import * as SecureStore from 'expo-secure-store';

export const PENDING_INVITE_KEY = 'raxa_pending_invite';

export async function savePendingInvite(code: string) {
  await SecureStore.setItemAsync(PENDING_INVITE_KEY, code);
}

export async function consumePendingInvite() {
  const code = await SecureStore.getItemAsync(PENDING_INVITE_KEY);

  if (code) {
    await SecureStore.deleteItemAsync(PENDING_INVITE_KEY);
  }

  return code;
}
