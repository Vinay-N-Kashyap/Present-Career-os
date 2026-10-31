export interface PlacementTier {
  tierName: string;
  targetCtc: string;
  companies: string[];
  readinessPct: number;
  status: 'Ready to Apply' | 'Developing' | 'Gap to Bridge';
  recommendedActions: string[];
  color: string;
}

export function computePlacementReadiness(careerScore: number, verifiedCount: number, completedQuestsCount: number): PlacementTier[] {
  // Tier 3: Mass Recruiter (TCS Ninja, Infosys DSE, Cognizant, Wipro) — ₹3.6 - ₹4.5 LPA
  const massScore = Math.min(100, Math.round(
    (completedQuestsCount >= 5 ? 40 : completedQuestsCount * 8) +
    Math.min(40, careerScore * 0.8) +
    (verifiedCount > 0 ? 20 : 0)
  ));

  // Tier 2: Differential / Specialized Services (Zoho, Accenture Adv, Hexaware) — ₹6.5 - ₹9.0 LPA
  const diffScore = Math.min(100, Math.round(
    Math.min(40, completedQuestsCount * 4) +
    Math.min(40, careerScore * 0.5) +
    Math.min(20, verifiedCount * 10)
  ));

  // Tier 1: High-Growth Product Companies (Swiggy, Razorpay, CRED, Flipkart) — ₹12 - ₹20 LPA
  const prodScore = Math.min(100, Math.round(
    Math.min(30, completedQuestsCount * 2) +
    Math.min(50, careerScore * 0.5) +
    Math.min(20, verifiedCount * 5)
  ));

  return [
    {
      tierName: 'Mass Recruiter Campus Drive',
      targetCtc: '₹3.6 - ₹4.5 LPA',
      companies: ['TCS Ninja', 'Infosys DSE', 'Cognizant', 'Wipro Elite'],
      readinessPct: massScore,
      status: massScore >= 75 ? 'Ready to Apply' : massScore >= 40 ? 'Developing' : 'Gap to Bridge',
      recommendedActions: massScore >= 75 ? ['Attempt Company Mock Assessment'] : ['Complete 3 more DSA Quests'],
      color: '#10b981',
    },
    {
      tierName: 'Differential & Specialized',
      targetCtc: '₹6.5 - ₹9.0 LPA',
      companies: ['Zoho Corp', 'TCS Digital', 'Accenture Adv', 'Persistent'],
      readinessPct: diffScore,
      status: diffScore >= 75 ? 'Ready to Apply' : diffScore >= 40 ? 'Developing' : 'Gap to Bridge',
      recommendedActions: diffScore >= 75 ? ['Upload Project to Vault'] : ['Master System Architecture Module'],
      color: '#3b82f6',
    },
    {
      tierName: 'Tier-1 Product & Tech Startups',
      targetCtc: '₹12.0 - ₹20.0 LPA',
      companies: ['Swiggy', 'Razorpay', 'CRED', 'Flipkart'],
      readinessPct: prodScore,
      status: prodScore >= 75 ? 'Ready to Apply' : prodScore >= 40 ? 'Developing' : 'Gap to Bridge',
      recommendedActions: ['Build High-Scale Distributed System Project'],
      color: '#8b5cf6',
    },
  ];
}
