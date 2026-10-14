import axios from 'axios';

const baseURL = process.env.EXPO_PUBLIC_API_URL?.trim();

if (!baseURL) {
  console.warn('EXPO_PUBLIC_API_URL is missing. Add it to .env and restart Expo.');
}

export const api = axios.create({
  baseURL: baseURL || 'http://localhost:5000',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Request failed';
  }
  return error instanceof Error ? error.message : 'Something went wrong';
}
