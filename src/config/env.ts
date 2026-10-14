
const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("EXPO_PUBLIC_API_URL is not configured.");
}

export const ENV = {
  API_URL: (API_URL || "http://192.168.1.12:5000").replace(/\/$/, ""),
};