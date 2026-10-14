
import { ENV } from "../config/env";
import type {
  ReferralHistory,
  ReferralProfile,
} from "../types/referral";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

async function getReferralData<T>(path: string): Promise<T> {
  const response = await fetch(`${ENV.API_URL}/api/referrals/${path}`);

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  const result = (await response.json()) as ApiResponse<T>;

  if (!result.success || !result.data) {
    throw new Error(result.message || "Unable to load referral data.");
  }

  return result.data;
}

export const referralService = {
  getMyReferral(clientId: string): Promise<ReferralProfile> {
    return getReferralData<ReferralProfile>(
      `me/${encodeURIComponent(clientId)}`,
    );
  },

  getReferralHistory(clientId: string): Promise<ReferralHistory> {
    return getReferralData<ReferralHistory>(
      `history/${encodeURIComponent(clientId)}`,
    );
  },
};