import { Cookies } from 'quasar';
import type { Checkout } from '@/api';
import { PaymentMethods } from '@/const/appointment';

type Payment = Checkout['multiChannelPay'][number];

interface AllCookies {
  firstToken: string;
  secondToken: string;
  lastSpaceId: number;
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

export function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]) {
  return Object.fromEntries(Object.entries(obj).filter((e, idx) => e[0] !== keys[idx])) as Omit<T, K>;
}

export function getArray(count: number) {
  return [...Array(count).keys()];
}

export function removeNullishKeys<T extends Record<string, any>>(obj: T): any {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => !(value === '' || value == null)));
}

export function extractUuidFromS3Url(url: string) {
  const uuidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
  const match = url.match(uuidRegex);

  if (match && match.length > 0) {
    return match[0];
  }
  return null;
}

export function checkGender(id: string | null) {
  if (!id) {
    return null;
  }
  return id.slice(1, 2) === '1' ? { name: 'male', label: '男' } : { name: 'female', label: '女' };
}

export function calcReceiptAmount(payments: Pick<Payment, 'payMethod' | 'amount'>[]) {
  const total = payments.reduce((acc, { payMethod, amount }) => {
    const paymentDetail = Object.values(PaymentMethods).find(item => item.identifier === payMethod)!;
    if (!paymentDetail.calcInReceipt || amount === null) {
      return acc;
    }
    return acc += amount;
  }, 0);
  return total;
}

export function showDecimal(val: number, places: number = 2) {
  return val.toFixed(places);
}

export function calcPercentage(divisor: number, dividend: number) {
  return dividend === 0 ? '0%' : `${Math.round((divisor / dividend) * 100)}%`;
}
