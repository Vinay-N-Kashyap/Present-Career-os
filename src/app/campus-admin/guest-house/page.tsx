import React from 'react';
import CentralGuestHouseManager from '@/components/admin/CentralGuestHouseManager';

export const metadata = {
  title: 'Central University Guest House & VIP Protocol Console | Campus Admin',
  description: 'Transit accommodation inventory, VIP protocol allocation, category tariff billing, and Estate Office audits.',
};

export default function GuestHousePage() {
  return <CentralGuestHouseManager />;
}
