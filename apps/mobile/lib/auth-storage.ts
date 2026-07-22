import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const authTokenKey = 'pharmacy-mvp-auth-token';

export async function getStoredAuthToken() {
  if (Platform.OS === 'web') {
    return getWebStorage()?.getItem(authTokenKey) ?? null;
  }

  return SecureStore.getItemAsync(authTokenKey);
}

export async function storeAuthToken(token: string) {
  if (Platform.OS === 'web') {
    getWebStorage()?.setItem(authTokenKey, token);
    return;
  }

  await SecureStore.setItemAsync(authTokenKey, token);
}

export async function clearStoredAuthToken() {
  if (Platform.OS === 'web') {
    getWebStorage()?.removeItem(authTokenKey);
    return;
  }

  await SecureStore.deleteItemAsync(authTokenKey);
}

function getWebStorage() {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}
