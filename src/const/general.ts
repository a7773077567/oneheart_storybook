export const TherapyTypes = {
  physicalConsultation: '物理諮詢門診',
  physicalTherapy: '物理治療門診',
  footPressure: '足壓門診',
  nutrition: '營養門診',
  sleep: '睡眠門診',
  sports: '運動諮詢',
  oneOnOne: '教練課',
  group: '團課',
  deanConsultation: '院長評估門診',
  deanTherapy: '院長物理治療',
  nutritionConsultation: '營養諮詢門診',
};

type TypeName = keyof typeof TherapyTypes;

const TabNames = ['clientInfo', 'medicalRecord', 'bodyAnalysis', 'memo', 'physicalConsultation', 'consultationAttachment', 'trainingPlan', 'sportClinic', 'groupClass', 'nutritionClinic', 'footPressure', 'sleepClinic'] as const;
const TabLabels = ['客戶資料', '病歷單', '身體組成表', 'MEMO', '諮詢表', '附件', '運動訓練單', '運動諮詢', '團體課程單', '營養諮詢單', '足壓門診單', '睡眠門診單'] as const;
export const TabMap = new Map(TabNames.map((item, idx) => [item, TabLabels[idx]]));

export enum ShiftType {
  物理諮詢門診 = 1,
  物理治療門診 = 2,
  足壓門診 = 3,
  營養門診 = 4,
  睡眠門診 = 5,
  院長評估門診 = 6,
  院長物理治療 = 7,
  營養諮詢門診 = 8,
  教練課 = 9,
  運動諮詢 = 10,
  團課 = 11,
}

type TabName = typeof TabNames[number];
interface Type {
  identifier: number;
  name: string;
  label: string;
  tabs: TabName[];
  canUsePoint: boolean;
  calcAmount: (usePoint?: boolean) => number;
}

export const Types: Record<TypeName, Type> = {
  physicalConsultation: {
    identifier: 1,
    name: 'physicalConsultation',
    label: '物理諮詢門診',
    tabs: ['clientInfo', 'physicalConsultation', 'consultationAttachment', 'bodyAnalysis', 'memo'],
    canUsePoint: false,
    calcAmount: () => 200,
  },
  physicalTherapy: {
    identifier: 2,
    name: 'physicalTherapy',
    label: '物理治療門診',
    tabs: ['clientInfo', 'medicalRecord', 'bodyAnalysis', 'memo'],
    canUsePoint: true,
    calcAmount: usePoint => usePoint ? 1 : 2000,
  },
  footPressure: {
    identifier: 3,
    name: 'footPressure',
    label: '足壓門診',
    tabs: ['clientInfo', 'footPressure', 'bodyAnalysis', 'memo'],
    canUsePoint: false,
    calcAmount: () => 2000,
  },
  nutrition: {
    identifier: 4,
    name: 'nutrition',
    label: '營養門診',
    tabs: ['clientInfo', 'nutritionClinic', 'bodyAnalysis', 'memo'],
    canUsePoint: true,
    calcAmount: usePoint => usePoint ? 1 : 2000,
  },
  sleep: {
    identifier: 5,
    name: 'sleep',
    label: '睡眠門診',
    tabs: ['clientInfo', 'sleepClinic', 'bodyAnalysis', 'memo'],
    canUsePoint: false,
    calcAmount: () => 2000,
  },
  deanConsultation: {
    identifier: 6,
    name: 'deanConsultation',
    label: '院長評估門診',
    tabs: ['clientInfo', 'physicalConsultation', 'consultationAttachment', 'bodyAnalysis', 'memo'],
    canUsePoint: false,
    calcAmount: () => 699,
  },
  deanTherapy: {
    identifier: 7,
    name: 'deanTherapy',
    label: '院長物理治療',
    tabs: ['clientInfo', 'medicalRecord', 'bodyAnalysis', 'memo'],
    canUsePoint: true,
    calcAmount: usePoint => usePoint ? 1 : 3000,
  },
  nutritionConsultation: {
    identifier: 8,
    name: 'nutritionConsultation',
    label: '營養諮詢門診',
    tabs: ['clientInfo', 'nutritionClinic', 'bodyAnalysis', 'memo'],
    canUsePoint: false,
    calcAmount: () => 499,
  },
  oneOnOne: {
    identifier: 9,
    name: 'oneOnOne',
    label: '教練課',
    tabs: ['clientInfo', 'trainingPlan', 'bodyAnalysis', 'memo'],
    canUsePoint: true,
    calcAmount: () => 1650, // to be confirmed
  },
  sports: {
    identifier: 10,
    name: 'sports',
    label: '運動諮詢',
    tabs: ['clientInfo', 'sportClinic', 'bodyAnalysis', 'memo'],
    canUsePoint: false,
    calcAmount: () => 200, // to be confirmed
  },
  group: {
    identifier: 11,
    name: 'group',
    label: '團課',
    tabs: ['clientInfo', 'groupClass'],
    canUsePoint: false,
    calcAmount: () => 1650, // to be confirmed
  },
};

// 點數群組
export enum PointTypes {
  '物理治療' = 1,
  '院長物理治療' = 2,
  '營養' = 3,
};

export const pointsGroupOptions = Object.keys(PointTypes).slice(3, 6).map(group => ({ label: group, value: PointTypes[group as keyof typeof PointTypes] }));

// 交易項目
export enum TransactionTypes {
  點數交易 = 1,
  門診費用 = 2,
  商品購買 = 3,
}

// 付款方式
export enum PaymentTypes {
  現金 = 1,
  匯款 = 2,
  信用卡 = 3,
  LINEPay = 4,
  街口 = 5,
  點數 = 6,
}
