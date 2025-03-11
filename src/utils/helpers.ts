import { Cookies } from 'quasar';
import { AccountState, type Checkout, type User, WorkState } from '@/api';
import { PaymentMethods } from '@/const/appointment';
import { ShiftType } from '@/const/general';
import type { IdentityType } from '@/const/client';

type Payment = Checkout['multiChannelPay'][number];

interface AllCookies {
  firstToken: string;
  secondToken: string;
  lastSpaceId: number;
  refreshToken: string;
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

export function updateCookie(key: keyof AllCookies, value: any) {
  Cookies.remove(key, { path: '/' });
  Cookies.set(key, value, { path: '/' });
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

export function checkGender(id: string | null, type: IdentityType) {
  if (!id) {
    return null;
  }
  const genderIdentify = id.slice(1, 2);
  if (type === 1) {
    return genderIdentify === '1' ? { name: 'male', label: '男' } : { name: 'female', label: '女' };
  }
  return genderIdentify === '8' ? { name: 'male', label: '先生' } : { name: 'female', label: '女士' };
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

// 科別順序
export function sortDepTypes<T extends Record<string, any>>(typesArr: T[], key: keyof T): T[] {
  const typesOrder = [
    ShiftType['物理治療門診'],
    ShiftType['院長物理治療'],
    ShiftType['物理治療體驗門診'],
    ShiftType['院長評估門診'],
    ShiftType['物理諮詢門診'],
    ShiftType['震波'],
    ShiftType['射頻'],
    ShiftType['磁波'],
    ShiftType['G動椅'],
    ShiftType['足壓門診'],
    ShiftType['睡眠門診'],
    ShiftType['營養門診'],
    ShiftType['營養諮詢門診'],
    ShiftType['新人實習門診'],
    ShiftType['教練課'],
    ShiftType['運動諮詢'],
    ShiftType['團課'],
  ] as const;
  return typesArr.slice().sort((a, b) => typesOrder.indexOf(a[key]) - typesOrder.indexOf(b[key]));
}

// 帳號為：開通、無停權、無離職
export function getOpenAccount(user: User) {
  return user.state === AccountState['開通'] && user.stateOfWork === WorkState['在職'];
}
