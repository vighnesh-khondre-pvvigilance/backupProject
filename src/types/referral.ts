
export type ReferralProfile = {
  clientId: string;
  referralCode: string;
  referralLink: string;
};

export type ReferralSummary = {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  failedReferrals: number;
  totalRewards: number;
};

export type ReferralClientDetails = {
  clientId: string;
  name: string | null;
  email?: string | null;
  contactNumber?: string | null;
};

export type ReferralHistoryItem = {
  referralId: string;
  referralCode: string;
  referrerClientId: string;
  referredClientId: string;
  referrerReward: number;
  referredReward: number;
  createdAt: string;
  completedAt?: string;
  rewardGiven: boolean;
  status: "COMPLETED" | "PENDING" | "FAILED" | string;

  // Client information from CLIENTS_TABLE
  referrer?: {
    clientId: string;
    name: string | null;
  } | null;

  referredClient?: ReferralClientDetails | null;
};

export type ReferralHistory = {
  summary: ReferralSummary;
  referrals: ReferralHistoryItem[];
};