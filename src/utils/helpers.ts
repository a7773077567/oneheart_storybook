import { Cookies } from 'quasar';
import type { RouteLocationMatched } from 'vue-router';

interface AllCookies {
  token: string;
};

export function getCookie(key: keyof AllCookies) {
  return Cookies.get(key);
}

export function setCookie(key: keyof AllCookies, value: any) {
  Cookies.set(key, value);
}

export function getUrl(path: string) {
  return new URL(path, import.meta.env.VITE_API_BASE_URL).toString();
}
