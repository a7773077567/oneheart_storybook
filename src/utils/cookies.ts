import { Cookies } from 'quasar';

interface AllCookies {
  token: string;
  accept: boolean;
};

export function getCookie(key: keyof AllCookies) {
  return Cookies.get(key);
}
