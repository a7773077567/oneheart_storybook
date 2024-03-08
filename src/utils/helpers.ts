import { Cookies } from 'quasar';

interface AllCookies {
  token: string;
};

interface SelectOption {
  label: number;
  value: number;
}

export function getCookie(key: keyof AllCookies) {
  return Cookies.get(key);
}

export function setCookie(key: keyof AllCookies, value: any) {
  Cookies.set(key, value, { path: '/' });
}

export function removeCookie(key: keyof AllCookies) {
  Cookies.remove(key, { path: '/' });
}

export function getUrl(path: string) {
  return new URL(path, import.meta.env.VITE_API_BASE_URL).toString();
}

export function getSequenceOptions(num: number): SelectOption[] {
  const numArray = [...Array(num).keys()];
  return numArray.map(num => ({
    label: num,
    value: num,
  }));
}
