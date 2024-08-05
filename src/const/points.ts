import { PointTypes } from '@/const/general';

interface PointsPlan {
  id: number;
  type: PointTypes;
  name: string;
  paidPointGained: number;
  giftPointGained: number;
  price: number;
}

export const pointsPlan: PointsPlan[] = [
  { id: 1, type: PointTypes.物理治療, name: '9500元：5堂', paidPointGained: 5, giftPointGained: 0, price: 9500 },
  { id: 2, type: PointTypes.物理治療, name: '20000元：10堂送1堂', paidPointGained: 10, giftPointGained: 1, price: 20000 },
  { id: 3, type: PointTypes.院長物理治療, name: '14500元：5堂', paidPointGained: 5, giftPointGained: 0, price: 14500 },
  { id: 4, type: PointTypes.院長物理治療, name: '30000元：10堂送1堂', paidPointGained: 10, giftPointGained: 1, price: 30000 },
  { id: 5, type: PointTypes.營養, name: '13500元：12堂', paidPointGained: 12, giftPointGained: 0, price: 13500 },
  { id: 6, type: PointTypes.教練課, name: '16500：10堂送1堂', paidPointGained: 10, giftPointGained: 1, price: 16500 },
  { id: 7, type: PointTypes.教練課, name: '45000：30堂送1堂', paidPointGained: 30, giftPointGained: 1, price: 45000 },
];
