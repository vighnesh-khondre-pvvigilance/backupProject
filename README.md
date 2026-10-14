# PVprotech Customer App

Starter Expo Router app for customer login/registration, email OTP verification, wallet balance and referral sharing. Configured for **Expo SDK 57** (React Native 0.86.3, React 19.2.3).

## Setup

1. Install **Node.js 22.13 or newer**.
2. Run `npm install`.
3. Run `npx expo install --fix` to align Expo modules with SDK 57.
4. Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL`.
   - Android emulator: `http://10.0.2.2:5000` is usually used to reach the host machine.
   - Physical phone: use your computer's LAN IP, e.g. `http://192.168.1.10:5000`, and ensure the phone and computer share a network.
   - iOS simulator: `http://localhost:5000` often works.
5. Start the backend and ensure it is reachable from the device.
6. Run `npx expo-doctor` to check project compatibility.
7. Run `npx expo start`.

## Backend contract expected

- `POST /auth/register-login` accepts `{ name, contactNumber, email, referralCode }`.
- Existing verified clients return `{ success: true, login: true, token, user }`.
- New clients return `{ success: true, verifyRequired: true, clientId, message }`.
- `POST /auth/verify-otp` accepts `{ clientId, otp }` and returns `{ success: true, token, user }`.
- `GET /auth/profile/:clientId` returns `{ success: true, user }`, with `balance` and `referralCode` fields.

## Notes

- The frontend uses `balance` as the wallet value and does not use a `coins` field.
- The referral URL shown by the share action is a placeholder web URL; update it to a real customer registration/deep link when that page/link is ready.
- The app expects the backend's existing policy: an already verified mobile number logs in without OTP; a new client gets email OTP.
- For production, protect the profile endpoint with JWT middleware and derive the client ID from the authenticated token rather than trusting a client ID supplied in the URL.
- Ensure the backend creates a pending referral during registration and atomically awards the referrer and referred client after OTP verification.
