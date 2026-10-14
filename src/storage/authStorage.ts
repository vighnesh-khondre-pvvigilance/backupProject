import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'pvprotech_customer_token';
const CLIENT_ID_KEY = 'pvprotech_customer_client_id';

export async function saveSession(token: string, clientId: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(CLIENT_ID_KEY, clientId);
}

export async function getSession() {
  const [token, clientId] = await Promise.all([
    SecureStore.getItemAsync(TOKEN_KEY),
    SecureStore.getItemAsync(CLIENT_ID_KEY),
  ]);
  return { token, clientId };
}

export async function clearSession() {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(CLIENT_ID_KEY),
  ]);
}
