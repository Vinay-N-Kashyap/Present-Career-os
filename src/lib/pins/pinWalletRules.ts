/**
 * Canonical PinIT Career OS Dual-Wallet Economy Rules
 * ---------------------------------------------------
 * 1. Current Pins (`users.pins`):
 *    - Hard daily capacity: 120 pins (`0 <= pins <= 120`).
 *    - Resets strictly to 120 every day at 1:00 AM IST (19:30 UTC) for ALL users —
 *      even if a user somehow held > 120 pins (e.g., 1000), it resets strictly to 120.
 *    - Every feature usage (AI Interview, Missions, Quests, GD, Arena, Projects,
 *      Shop, AI Tutor, Resume, etc.) deducts STRICTLY from Current Pins, NEVER from Bonus Pins.
 *
 * 2. Bonus Vault Pins (`users.bonus_pins`):
 *    - Unlimited capacity, never wiped or reset at 1:00 AM IST.
 *    - Cannot be spent directly on features.
 *    - When Current Pins are between 0 and 119, the user can refill Current Pins up to 120
 *      from their Bonus Vault (via `/api/pins/claim-bonus`) or by purchasing pins.
 *
 * 3. Purchasing / Crediting Pins:
 *    - A single purchase credits BOTH Current Pins (filling any room up to 120 first)
 *      AND Bonus Vault Pins (all overflow beyond the 120 current cap) at once.
 */

export const DAILY_PIN_CAP = 120;
export const DAILY_RESET_HOUR_IST = 1;
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/**
 * Returns the most recent 1:00 AM IST boundary (19:30 UTC of the corresponding calendar day)
 * that is <= `now`.
 */
export function getLatest1AmIst(now: Date = new Date()): Date {
  const istMs = now.getTime() + IST_OFFSET_MS;
  const ist = new Date(istMs);
  const boundaryIst = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate(), DAILY_RESET_HOUR_IST, 0, 0, 0));
  if (ist.getUTCHours() < DAILY_RESET_HOUR_IST) {
    boundaryIst.setUTCDate(boundaryIst.getUTCDate() - 1);
  }
  return new Date(boundaryIst.getTime() - IST_OFFSET_MS);
}

/**
 * Returns the next upcoming 1:00 AM IST boundary strictly > `now`.
 */
export function getNext1AmIst(now: Date = new Date()): Date {
  const latest = getLatest1AmIst(now);
  return new Date(latest.getTime() + 24 * 60 * 60 * 1000);
}

export interface PlanEligibilityRecord {
  subscription_status?: string | null;
  subscription_tier?: string | null;
  subscription_expires_at?: string | null;
  hasPaidEnrollment?: boolean;
  hasPaidPlanPayment?: boolean;
}

/**
 * Determines whether a user qualifies for the 1:00 AM IST daily reset to 120 Current Pins:
 * true if the user has an active purchased subscription OR an active course/crash plan purchase.
 */
export function hasActivePurchasedPlan(record: PlanEligibilityRecord | null | undefined, now: Date = new Date()): boolean {
  if (!record) return false;
  if (record.hasPaidEnrollment || record.hasPaidPlanPayment) return true;

  const status = String(record.subscription_status || '').trim().toLowerCase();
  const tier = String(record.subscription_tier || '').trim().toLowerCase();
  const hasPaidTier = Boolean(tier && tier !== 'free' && tier !== 'none');

  if (status === 'active' && hasPaidTier) {
    if (!record.subscription_expires_at) return true;
    const expiresMs = Date.parse(record.subscription_expires_at);
    return Number.isFinite(expiresMs) ? expiresMs > now.getTime() : true;
  }

  return false;
}

function toNonNegativeInt(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
}

export interface WalletSplitResult {
  newPins: number;
  newBonus: number;
  toCurrent: number;
  toBonus: number;
}

/**
 * Credits `grantedPins` (from purchase, streak bonus, or reward):
 * fills Current Pins up to `dailyCap` (120) first, then deposits the remainder
 * into Bonus Vault (`bonus_pins`), which has no limit.
 */
export function splitCreditIntoWallets(
  currentPins: number,
  currentBonus: number,
  grantedPins: number,
  dailyCap: number = DAILY_PIN_CAP
): WalletSplitResult {
  const safeCurrent = toNonNegativeInt(currentPins);
  const safeBonus = toNonNegativeInt(currentBonus);
  const safeGrant = toNonNegativeInt(grantedPins);
  const cap = Math.max(0, Math.floor(dailyCap));

  if (safeGrant === 0) {
    return {
      newPins: safeCurrent,
      newBonus: safeBonus,
      toCurrent: 0,
      toBonus: 0,
    };
  }

  const spaceInCurrent = Math.max(0, cap - safeCurrent);
  const toCurrent = Math.min(safeGrant, spaceInCurrent);
  const toBonus = safeGrant - toCurrent;

  return {
    newPins: safeCurrent + toCurrent,
    newBonus: safeBonus + toBonus,
    toCurrent,
    toBonus,
  };
}

/**
 * Subscription activation (Basic / Pro):
 * fills Current Pins to `dailyCap` (120), never leaving Current Pins above 120
 * (any legacy overflow above 120 is safely moved to Bonus Vault so zero pins are lost),
 * and adds any subscription bonus pins (e.g., Pro +500) to Bonus Vault.
 */
export function computeSubscriptionActivation(
  currentPins: number,
  currentBonus: number,
  subscriptionBonusPins: number = 0,
  dailyCap: number = DAILY_PIN_CAP
): WalletSplitResult {
  const safeCurrent = toNonNegativeInt(currentPins);
  const safeBonus = toNonNegativeInt(currentBonus);
  const safeSubBonus = toNonNegativeInt(subscriptionBonusPins);
  const cap = Math.max(0, Math.floor(dailyCap));

  const legacyOverflow = Math.max(0, safeCurrent - cap);
  const toCurrent = Math.max(0, cap - Math.min(safeCurrent, cap));
  const toBonus = safeSubBonus + legacyOverflow;

  return {
    newPins: cap,
    newBonus: safeBonus + toBonus,
    toCurrent,
    toBonus,
  };
}

export interface BonusClaimResult {
  ok: boolean;
  error?: 'NO_BONUS_PINS' | 'CURRENT_PINS_FULL';
  claimed: number;
  newPins: number;
  remainingBonus: number;
  spaceInCurrent: number;
}

/**
 * Refills Current Pins from Bonus Vault up to the 120 daily cap.
 * If Current Pins are already >= 120, rejects with `CURRENT_PINS_FULL`.
 */
export function computeBonusClaimToCurrent(
  currentPins: number,
  currentBonus: number,
  requestedAmount?: number | null,
  dailyCap: number = DAILY_PIN_CAP
): BonusClaimResult {
  const safeCurrent = toNonNegativeInt(currentPins);
  const safeBonus = toNonNegativeInt(currentBonus);
  const cap = Math.max(0, Math.floor(dailyCap));
  const spaceInCurrent = Math.max(0, cap - safeCurrent);

  if (safeBonus <= 0) {
    return {
      ok: false,
      error: 'NO_BONUS_PINS',
      claimed: 0,
      newPins: safeCurrent,
      remainingBonus: 0,
      spaceInCurrent,
    };
  }

  if (spaceInCurrent <= 0) {
    return {
      ok: false,
      error: 'CURRENT_PINS_FULL',
      claimed: 0,
      newPins: safeCurrent,
      remainingBonus: safeBonus,
      spaceInCurrent: 0,
    };
  }

  const desired =
    typeof requestedAmount === 'number' && Number.isFinite(requestedAmount) && requestedAmount > 0
      ? Math.floor(requestedAmount)
      : spaceInCurrent;

  const claimed = Math.min(desired, spaceInCurrent, safeBonus);

  return {
    ok: true,
    claimed,
    newPins: safeCurrent + claimed,
    remainingBonus: safeBonus - claimed,
    spaceInCurrent,
  };
}

/**
 * Daily 1:00 AM IST reset:
 * - If user has purchased any active plan (`hasPurchasedPlan === true`): Current Pins reset strictly to 120.
 * - Else (free / no plan): Current Pins remain unchanged.
 * Bonus Vault pins are never touched or capped.
 */
export function computeDailyResetWallet(
  currentPins: number,
  currentBonus: number,
  dailyCap: number = DAILY_PIN_CAP,
  hasPurchasedPlan: boolean = true
): { pins: number; bonusPins: number } {
  const safeCurrent = toNonNegativeInt(currentPins);
  const safeBonus = toNonNegativeInt(currentBonus);
  if (!hasPurchasedPlan) {
    return {
      pins: safeCurrent,
      bonusPins: safeBonus,
    };
  }
  return {
    pins: Math.max(0, Math.floor(dailyCap)),
    bonusPins: safeBonus,
  };
}

/**
 * Feature spending affordability check:
 * STRICTLY checks Current Pins (`pins`). Bonus Vault pins cannot directly pay for features.
 */
export function canSpendFromCurrentPins(currentPins: number, cost: number): boolean {
  const safeCost = toNonNegativeInt(cost);
  if (safeCost === 0) return true;
  return toNonNegativeInt(currentPins) >= safeCost;
}

export interface CurrentOnlySpendResult {
  ok: boolean;
  error?: 'INSUFFICIENT_PINS';
  newPins: number;
  newBonus: number;
  shortfall: number;
  canRefillFromBonus: boolean;
  refillableAmount: number;
}

/**
 * Deducts `cost` STRICTLY from Current Pins (`pins`).
 * Never deducts from `bonus_pins`. When Current Pins are insufficient, reports whether
 * the user can refill Current Pins from their Bonus Vault.
 */
export function spendFromCurrentPinsOnly(
  currentPins: number,
  currentBonus: number,
  cost: number,
  dailyCap: number = DAILY_PIN_CAP
): CurrentOnlySpendResult {
  const safeCurrent = toNonNegativeInt(currentPins);
  const safeBonus = toNonNegativeInt(currentBonus);
  const safeCost = toNonNegativeInt(cost);
  const cap = Math.max(0, Math.floor(dailyCap));

  if (safeCurrent < safeCost) {
    const spaceInCurrent = Math.max(0, cap - safeCurrent);
    const refillableAmount = Math.min(safeBonus, spaceInCurrent);
    return {
      ok: false,
      error: 'INSUFFICIENT_PINS',
      newPins: safeCurrent,
      newBonus: safeBonus,
      shortfall: safeCost - safeCurrent,
      canRefillFromBonus: refillableAmount > 0,
      refillableAmount,
    };
  }

  return {
    ok: true,
    newPins: safeCurrent - safeCost,
    newBonus: safeBonus,
    shortfall: 0,
    canRefillFromBonus: false,
    refillableAmount: 0,
  };
}
