// 堂數群組
export enum PointTypes {
  '物理治療' = 1,
  '院長物理治療' = 2,
  '營養' = 3,
  '教練課' = 4,
};

export const TherapyTypes = {
  physicalConsultation: '物理諮詢門診',
  physicalTherapy: '物理治療門診',
  footPressure: '足壓門診',
  nutrition: '營養門診',
  sleep: '睡眠門診',
  deanConsultation: '院長評估門診',
  deanTherapy: '院長物理治療',
  nutritionConsultation: '營養諮詢門診',
  sports: '運動諮詢',
  oneOnOne: '教練課',
  group: '團課',
  physicalTrial: '物理治療體驗門診',
  InternshipClinic: '新人實習門診',
};

// 場館類別
export enum SpaceType {
  物理診所 = 1,
  運動場館 = 2,
  綜合 = 3,
}

export const SportTherapyTypes = {
  sports: '運科門診',
  oneOnOne: '教練課',
};

type TypeName = keyof typeof TherapyTypes;

const TabNames = ['clientInfo', 'medicalRecord', 'bodyAnalysis', 'memo', 'physicalConsultation', 'consultationAttachment', 'trainingPlan', 'sportClinic', 'groupClass', 'nutritionClinic', 'footPressure', 'sleepClinic', 'addOnPrice'] as const;
const TabLabels = ['客戶資料', '病歷單', '身體組成表', 'MEMO', '諮詢表', '附件', '運動訓練單', '運動諮詢', '團體課程單', '營養諮詢單', '足壓門診單', '睡眠門診單', '加價服務'] as const;
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
  物理治療體驗門診 = 12,
  新人實習門診 = 13,
}
const ShiftTypeConst = {
  物理諮詢門診: 1,
  物理治療門診: 2,
  足壓門診: 3,
  營養門診: 4,
  睡眠門診: 5,
  院長評估門診: 6,
  院長物理治療: 7,
  營養諮詢門診: 8,
  教練課: 9,
  運動諮詢: 10,
  團課: 11,
  物理治療體驗門診: 12,
  新人實習門診: 13,
} as const;

type TabName = typeof TabNames[number];
interface Type {
  identifier: typeof ShiftTypeConst[keyof typeof ShiftTypeConst];
  name: string;
  label: string;
  tabs: TabName[];
  canUsePoint: boolean;
  calcAmount: (usePoint?: boolean) => number;
  spaceType: SpaceType;
  showInOptions: boolean;
  pointType?: number;
}

export const Types: Record<TypeName, Type> = {
  physicalConsultation: {
    identifier: ShiftType['物理諮詢門診'],
    name: 'physicalConsultation',
    label: '物理諮詢門診',
    tabs: ['clientInfo', 'physicalConsultation', 'consultationAttachment', 'addOnPrice', 'bodyAnalysis', 'memo'],
    canUsePoint: false,
    calcAmount: () => 200,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
  },
  physicalTherapy: {
    identifier: ShiftType['物理治療門診'],
    name: 'physicalTherapy',
    label: '物理治療門診',
    tabs: ['clientInfo', 'medicalRecord', 'addOnPrice', 'bodyAnalysis', 'memo'],
    canUsePoint: true,
    calcAmount: usePoint => usePoint ? 1 : 2000,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
    pointType: PointTypes['物理治療'],
  },
  footPressure: {
    identifier: ShiftType['足壓門診'],
    name: 'footPressure',
    label: '足壓門診',
    tabs: ['clientInfo', 'footPressure', 'addOnPrice', 'bodyAnalysis', 'memo'],
    canUsePoint: false,
    calcAmount: () => 2000,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
  },
  nutrition: {
    identifier: ShiftType['營養門診'],
    name: 'nutrition',
    label: '營養門診',
    tabs: ['clientInfo', 'nutritionClinic', 'addOnPrice', 'bodyAnalysis', 'memo'],
    canUsePoint: true,
    calcAmount: usePoint => usePoint ? 1 : 2000,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
  },
  sleep: {
    identifier: ShiftType['睡眠門診'],
    name: 'sleep',
    label: '睡眠門診',
    tabs: ['clientInfo', 'sleepClinic', 'addOnPrice', 'bodyAnalysis', 'memo'],
    canUsePoint: false,
    calcAmount: () => 2000,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
  },
  deanConsultation: {
    identifier: ShiftType['院長評估門診'],
    name: 'deanConsultation',
    label: '院長評估門診',
    tabs: ['clientInfo', 'physicalConsultation', 'consultationAttachment', 'addOnPrice', 'bodyAnalysis', 'memo'],
    canUsePoint: false,
    calcAmount: () => 699,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
  },
  deanTherapy: {
    identifier: ShiftType['院長物理治療'],
    name: 'deanTherapy',
    label: '院長物理治療',
    tabs: ['clientInfo', 'medicalRecord', 'addOnPrice', 'bodyAnalysis', 'memo'],
    canUsePoint: true,
    calcAmount: usePoint => usePoint ? 1 : 3000,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
    pointType: PointTypes['院長物理治療'],
  },
  nutritionConsultation: {
    identifier: ShiftType['營養諮詢門診'],
    name: 'nutritionConsultation',
    label: '營養諮詢門診',
    tabs: ['clientInfo', 'nutritionClinic', 'addOnPrice', 'bodyAnalysis', 'memo'],
    canUsePoint: false,
    calcAmount: () => 499,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
    pointType: PointTypes['營養'],
  },
  oneOnOne: {
    identifier: ShiftType['教練課'],
    name: 'coachClass',
    label: '教練課',
    tabs: ['clientInfo', 'trainingPlan', 'addOnPrice', 'bodyAnalysis', 'memo'],
    canUsePoint: true,
    calcAmount: () => 1650, // to be confirmed
    spaceType: SpaceType['運動場館'],
    showInOptions: true,
    pointType: PointTypes['教練課'],
  },
  sports: {
    identifier: ShiftType['運動諮詢'],
    name: 'sportConsultation',
    label: '運動諮詢',
    tabs: ['clientInfo', 'sportClinic', 'addOnPrice', 'bodyAnalysis', 'memo'],
    canUsePoint: false,
    calcAmount: () => 200, // to be confirmed
    spaceType: SpaceType['運動場館'],
    showInOptions: true,
  },
  group: {
    identifier: ShiftType['團課'],
    name: 'groupClass',
    label: '團課',
    tabs: ['clientInfo', 'groupClass', 'addOnPrice'],
    canUsePoint: false,
    calcAmount: () => 1650, // to be confirmed
    spaceType: SpaceType['運動場館'],
    showInOptions: false,
  },
  physicalTrial: {
    identifier: ShiftType['物理治療體驗門診'],
    name: 'physicalTrial',
    label: '物理治療體驗門診',
    tabs: ['clientInfo', 'physicalConsultation', 'consultationAttachment', 'addOnPrice', 'bodyAnalysis', 'memo'],
    canUsePoint: false,
    calcAmount: () => 200,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
  },
  InternshipClinic: {
    identifier: ShiftType['新人實習門診'],
    name: 'physicalTherapy',
    label: '新人實習門診',
    tabs: ['clientInfo', 'medicalRecord', 'addOnPrice', 'bodyAnalysis', 'memo'],
    canUsePoint: false,
    calcAmount: () => 200,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
  },
};

export const pointsGroupOptions = Object.keys(PointTypes).slice(4, 8).map(group => ({ label: group, value: PointTypes[group as keyof typeof PointTypes] }));

// 交易項目
export enum TransactionTypes {
  堂數交易 = 1,
  門診費用 = 2,
  團課券購買 = 3,
  堂數退款 = 4,
  團課券退款 = 5,
}

// 付款方式
export enum PaymentTypes {
  現金 = 1,
  匯款 = 2,
  信用卡 = 3,
  LINEPay = 4,
  街口 = 5,
  堂數 = 6,
  團課券 = 7,
  主管折扣 = 8,
  折價券 = 9,
  抵用券 = 10,
  訂金 = 11,
  行銷活動 = 12,
}

export const genderOptions = ['生理男', '生理女'].map(o => ({ label: o, value: o }));
