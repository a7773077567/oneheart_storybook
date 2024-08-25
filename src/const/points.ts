import { PointTypes } from '@/const/general';

interface PointsPlan {
  id: number;
  type: PointTypes | 'all';
  name: string;
  paidPointGained: number;
  giftPointGained: number;
  price: number;
}

export const PointPlan: { [plan: number]: string } = {
  1: '9500元：5堂',
  2: '20000元：10堂送1堂',
  3: '14500元：5堂',
  4: '30000元：10堂送1堂',
  5: '13500元：12堂',
  6: '16500：10堂送1堂',
  7: '45000：30堂送1堂',
  8: '開帳包：0堂',
};

export const pointsPlan: PointsPlan[] = [
  { id: 1, type: PointTypes.物理治療, name: PointPlan[1], paidPointGained: 5, giftPointGained: 0, price: 9500 },
  { id: 2, type: PointTypes.物理治療, name: PointPlan[2], paidPointGained: 10, giftPointGained: 1, price: 20000 },
  { id: 3, type: PointTypes.院長物理治療, name: PointPlan[3], paidPointGained: 5, giftPointGained: 0, price: 14500 },
  { id: 4, type: PointTypes.院長物理治療, name: PointPlan[4], paidPointGained: 10, giftPointGained: 1, price: 30000 },
  { id: 5, type: PointTypes.營養, name: PointPlan[5], paidPointGained: 12, giftPointGained: 0, price: 13500 },
  { id: 6, type: PointTypes.教練課, name: PointPlan[6], paidPointGained: 10, giftPointGained: 1, price: 16500 },
  { id: 7, type: PointTypes.教練課, name: PointPlan[7], paidPointGained: 30, giftPointGained: 1, price: 45000 },
  { id: 8, type: 'all', name: PointPlan[8], paidPointGained: 0, giftPointGained: 0, price: 0 },
];
