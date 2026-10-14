import { api } from './api';

export type ClientUser = {
  clientId: string;
  name?: string;
  contactNumber?: string;
  phone?: string;
  email?: string | null;
  role?: string;
  referralCode?: string | null;
  referredBy?: string | null;
  balance?: number;
  isVerified?: boolean;
};

type AuthResponse = {
  success: boolean;
  message?: string;
  login?: boolean;
  verifyRequired?: boolean;
  clientId?: string;
  token?: string;
  user?: ClientUser;
};

export async function registerOrLogin(input: {
  name?: string;
  contactNumber: string;
  email?: string;
  referralCode?: string;
}) {
  const response = await api.post<AuthResponse>('/auth/register-login', {
    name: input.name?.trim(),
    contactNumber: input.contactNumber.trim(),
    email: input.email?.trim() || undefined,
    referralCode: input.referralCode?.trim().toUpperCase() || null,
  });
  return response.data;
}

export async function verifyOtp(clientId: string, otp: string) {
  const response = await api.post<AuthResponse>('/auth/verify-otp', {
    clientId,
    otp: otp.trim(),
  });
  return response.data;
}

export async function fetchClientProfile(clientId: string) {
  const response = await api.get<{ success: boolean; user: ClientUser; message?: string }>(
    `/auth/profile/${encodeURIComponent(clientId)}`,
  );
  return response.data;
}
