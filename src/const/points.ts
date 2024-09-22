import { PointTypes } from '@/const/general';

interface PointsPlan {
  name: string;
  paidPointGained: number;
  giftPointGained: number;
  price: number;
  for?: PointTypes[];
}
export const POINTS_PLAN: { [counting: number]: PointsPlan } = {
  1: {
    name: '9500元：5堂',
    paidPointGained: 5,
    giftPointGained: 0,
    price: 9500,
    for: [PointTypes.物理治療],
  },
  2: {
    name: '20000元：10堂送1堂',
    paidPointGained: 10,
    giftPointGained: 1,
    price: 20000,
    for: [PointTypes.物理治療],
  },
  3: {
    name: '14500元：5堂',
    paidPointGained: 5,
    giftPointGained: 0,
    price: 14500,
    for: [PointTypes.院長物理治療],
  },
  4: {
    name: '30000元：10堂送1堂',
    paidPointGained: 10,
    giftPointGained: 1,
    price: 30000,
    for: [PointTypes.院長物理治療],
  },
  5: {
    name: '13500元：12堂',
    paidPointGained: 12,
    giftPointGained: 0,
    price: 13500,
    for: [PointTypes.營養],
  },
  6: {
    name: '16500：10堂送1堂',
    paidPointGained: 10,
    giftPointGained: 1,
    price: 16500,
    for: [PointTypes.教練課],
  },
  7: {
    name: '45000：30堂送1堂',
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
    name: '試營運：初診3堂5550',
    paidPointGained: 3,
    giftPointGained: 0,
    price: 55500,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  10: {
    name: '試營運：初診5堂8800',
    paidPointGained: 5,
    giftPointGained: 0,
    price: 8800,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  11: {
    name: '試營運：初診10堂18700',
    paidPointGained: 10,
    giftPointGained: 0,
    price: 18700,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  12: {
    name: '試營運：複診5堂9300',
    paidPointGained: 5,
    giftPointGained: 0,
    price: 9300,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  13: {
    name: '試營運：複診10堂19360',
    paidPointGained: 10,
    giftPointGained: 0,
    price: 19360,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  14: {
    name: '試營運：初診單堂1500',
    paidPointGained: 1,
    giftPointGained: 0,
    price: 1500,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  15: {
    name: '試營運：複診單堂2000',
    paidPointGained: 1,
    giftPointGained: 0,
    price: 2000,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  16: {
    name: '試營運：初診單堂1400',
    paidPointGained: 1,
    giftPointGained: 0,
    price: 1400,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  17: {
    name: '試營運：初診5堂8750',
    paidPointGained: 5,
    giftPointGained: 0,
    price: 8700,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  18: {
    name: '試營運：初診10堂17000',
    paidPointGained: 10,
    giftPointGained: 0,
    price: 17000,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  19: {
    name: '試營運：初診20堂33400',
    paidPointGained: 20,
    giftPointGained: 0,
    price: 33400,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  20: {
    name: '試營運：複診單堂1900',
    paidPointGained: 1,
    giftPointGained: 0,
    price: 1900,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  21: {
    name: '試營運：複診5堂9250',
    paidPointGained: 5,
    giftPointGained: 0,
    price: 9250,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  22: {
    name: '試營運：復診10堂17500',
    paidPointGained: 10,
    giftPointGained: 0,
    price: 17500,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  23: {
    name: '試營運：復診20堂34000',
    paidPointGained: 20,
    giftPointGained: 0,
    price: 34000,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
  24: {
    name: '試營運：矯正方案18700',
    paidPointGained: 1,
    giftPointGained: 0,
    price: 18700,
    for: [PointTypes.物理治療, PointTypes.院長物理治療],
  },
} as const;

interface TypePlan {
  id: number;
  type: PointTypes;
  plans: (keyof typeof POINTS_PLAN)[];

}

const physicalRelatedPlans = Array(16).fill(9).map((plan, idx) => plan + idx);
export const plansByType: TypePlan[] = [
  { id: 1, type: PointTypes.物理治療, plans: [1, 2, 8, ...physicalRelatedPlans] },
  { id: 2, type: PointTypes.院長物理治療, plans: [3, 4, 8, ...physicalRelatedPlans] },
  { id: 3, type: PointTypes.營養, plans: [5, 8, ...physicalRelatedPlans] },
  { id: 4, type: PointTypes.教練課, plans: [6, 7, 8, ...physicalRelatedPlans] },
];

// 方案總表
// 1: '9500元：5堂',
// 2: '20000元：10堂送1堂',
// 3: '14500元：5堂',
// 4: '30000元：10堂送1堂',
// 5: '13500元：12堂',
// 6: '16500：10堂送1堂',
// 7: '45000：30堂送1堂',
// 8: '開帳包：0堂',
// 9. 試營運初診3堂5550
// 10. 試營運初診5堂8800
// 11. 試營運初診10堂18700
// 12. 試營運複診5堂9300
// 13. 試營運複診10堂19360
// 14. 試營運初診單堂1500
// 15. 試營運複診單堂2000
// 16. 開幕初診單堂1400
// 17. 開幕初診5堂8750
// 18. 開幕初診10堂17000
// 19. 開幕初診20堂33400
// 20. 開幕複診單堂1900
// 21. 開幕復診5堂9250
// 22. 開幕復診10堂17500
// 23. 開幕復診20堂34000
// 24. 體態矯正方案18700
