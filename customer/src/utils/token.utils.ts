import * as SecureStore from "expo-secure-store";

let inMemoryAccessToken: string | null = null;
let inMemoryRefreshToken: string | null = null;

export async function saveTokens(accessToken: string, refreshToken: string) {
  await SecureStore.setItemAsync("accessToken", accessToken);
  await SecureStore.setItemAsync("refreshToken", refreshToken);
}

export async function getAccessToken() {
  return await SecureStore.getItemAsync("accessToken");
}

export async function getAccessTokenCached() {
  if (!inMemoryAccessToken) {
    inMemoryAccessToken = await SecureStore.getItemAsync("accessToken");
  }

  const token = await getAccessToken();
  inMemoryAccessToken = token;

  return token;
}

export async function getRefreshToken() {
  return await SecureStore.getItemAsync("refreshToken");
}

export async function getRefreshTokenCached() {
  if (!inMemoryRefreshToken) {
    inMemoryRefreshToken = await SecureStore.getItemAsync("refreshToken");
  }

  const token = await getRefreshToken();
  inMemoryRefreshToken = token;

  return token;
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
}
