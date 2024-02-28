import { type Configuration, PublicClientApplication } from '@azure/msal-browser';

const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MICROSOFT_TENANT_ID}`,
    redirectUri: 'http://localhost:5173',
  },
};
const MSAL = new PublicClientApplication(msalConfig);
await MSAL.initialize();

export function useMsal() {
  return { loginPopup };

  async function loginPopup() {
    const res = await MSAL.loginPopup({
      prompt: 'select_account', // Force an account chooser, otherwise, it will login automatically if there is a cache
      scopes: ['user.read'],
    });
    return res;
  }
}
