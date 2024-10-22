import { PointTypes } from '@/const/general';

interface PointsPlan {
  name: string;
  paidPointGained: number;
  giftPointGained: number;
  price: number;
  for: PointTypes[];
}
export const POINTS_PLAN: { [counting: number]: PointsPlan } = {
  1: {
    name: '$9500：5堂',
    paidPointGained: 5,
    giftPointGained: 0,
    price: 9500,
    for: [PointTypes.物理治療],
  },
  2: {
    name: '$20,000：10堂送1堂',
    paidPointGained: 10,
    giftPointGained: 1,
    price: 20000,
    for: [PointTypes.物理治療],
  },
  3: {
    name: '$14,500：5堂',
    paidPointGained: 5,
    giftPointGained: 0,
    price: 14500,
    for: [PointTypes.院長物理治療],
  },
  4: {
    name: '$30,000：10堂送1堂',
    paidPointGained: 10,
    giftPointGained: 1,
    price: 30000,
    for: [PointTypes.院長物理治療],
  },
  5: {
    name: '$13,500：12堂',
    paidPointGained: 12,
    giftPointGained: 0,
    price: 13500,
    for: [PointTypes.營養],
  },
  6: {
    name: '$16,500：10堂送1堂',
    paidPointGained: 10,
    giftPointGained: 1,
    price: 16500,
    for: [PointTypes.教練課],
  },
  7: {
    name: '$45,000：30堂送1堂',
    paidPointGained: 30,
    giftPointGained: 1,
    price: 45000,
    for: [PointTypes.教練課],
  },
  8: {
    name: '開帳包：0堂',
    paidPointGained: 0,
    giftPointGained: 0,
    price: 0,
    for: [PointTypes.物理治療, PointTypes.院長物理治療, PointTypes.教練課, PointTypes.營養],
  },
  9: {
    name: '矯正方案$18,700',
    paidPointGained: 1,
    giftPointGained: 0,
    price: 18700,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  10: {
    name: '軍警消醫護5堂 $7,500',
    paidPointGained: 5,
    giftPointGained: 0,
    price: 7500,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  11: {
    name: '軍警消醫護10堂 $15,000',
    paidPointGained: 10,
    giftPointGained: 0,
    price: 15000,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  12: {
    name: 'winback能量治療五堂 $9,500',
    paidPointGained: 5,
    giftPointGained: 0,
    price: 9500,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  13: {
    name: 'winback能量治療十堂送一 $20,000',
    paidPointGained: 10,
    giftPointGained: 1,
    price: 20000,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  14: {
    name: '教練課5堂 $8,000',
    paidPointGained: 5,
    giftPointGained: 0,
    price: 8000,
    for: [PointTypes.教練課],
  },
  15: {
    name: '藝文初診５堂$8,850',
    paidPointGained: 5,
    giftPointGained: 0,
    price: 8850,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  16: {
    name: '藝文複診５堂$9,250',
    paidPointGained: 5,
    giftPointGained: 0,
    price: 9250,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  17: {
    name: '藝文初診10堂$17,200',
    paidPointGained: 10,
    giftPointGained: 0,
    price: 17200,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  18: {
    name: '藝文複診10堂$17,500',
    paidPointGained: 10,
    giftPointGained: 0,
    price: 17500,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  19: {
    name: '藝文初診20堂$33,400',
    paidPointGained: 20,
    giftPointGained: 0,
    price: 33400,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  20: {
    name: '藝文複診20堂$34,000',
    paidPointGained: 20,
    giftPointGained: 0,
    price: 34000,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
} as const;

interface TypePlan {
  id: number;
  type: PointTypes;
  plans: (keyof typeof POINTS_PLAN)[];

}

const getPlanByType = (plan: PointTypes) => Object.keys(POINTS_PLAN).map(plan => +plan).filter(planNumber => POINTS_PLAN[+planNumber as keyof typeof POINTS_PLAN].for?.includes(plan));

export const plansByType: TypePlan[] = [
  { id: 1, type: PointTypes.物理治療, plans: getPlanByType(PointTypes.物理治療) },
  { id: 2, type: PointTypes.院長物理治療, plans: getPlanByType(PointTypes.院長物理治療) },
  { id: 3, type: PointTypes.營養, plans: getPlanByType(PointTypes.營養) },
  { id: 4, type: PointTypes.教練課, plans: getPlanByType(PointTypes.教練課),
  },
];

// 方案總表: https://www.notion.so/enginelin/faf06bae4bbf4069baba2c5c9ee54146?pvs=4
