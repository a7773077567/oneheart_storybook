import { RoleType } from '@/const/user';

// 堂數群組
export enum PointTypes {
  '物理治療' = 1,
  '院長物理治療' = 2,
  '營養' = 3,
  '教練課' = 4,
  '震波' = 5,
  '射頻' = 6,
  '磁波' = 7,
  'G動椅' = 8,
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
  shockWave: '震波',
  radioFrequency: '射頻',
  magneticWave: '磁波',
  GChair: 'G動椅',
  familyAssessment: '家庭評估門診',
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

const TabNames = ['clientInfo', 'medicalRecord', 'bodyAnalysis', 'memo', 'physicalConsultation', 'consultationAttachment', 'trainingPlan', 'sportClinic', 'groupClass', 'nutritionClinic', 'footPressure', 'sleepClinic', 'addOnPrice', 'pointsGroup', 'magneticWaveRecord', 'gChairRecord'] as const;
const TabLabels = ['客戶資料', '病歷單', '身體組成表', 'MEMO', '諮詢表', '附件', '運動訓練單', '運動諮詢', '團體課程單', '營養諮詢單', '足壓門診單', '睡眠門診單', '加價服務', '群組與堂數', '磁波病例單', 'G動椅病例單'] as const;
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
  震波 = 14,
  射頻 = 15,
  磁波 = 16,
  G動椅 = 17,
  家庭評估門診 = 18,
}

// 物理治療項目：只有以下 5 個科別屬於物理治療項目
// https://www.notion.so/enginelin/fe29a884eab74700a7c01e75875f72ff?pvs=4
export const PhysicalTypes = [
  ShiftType['物理諮詢門診'],
  ShiftType['物理治療門診'],
  ShiftType['院長物理治療'],
  ShiftType['院長評估門診'],
  ShiftType['物理治療體驗門診'],
  ShiftType['家庭評估門診'],
] as const;

// 儀器治療項目
export const MachineShifts = [
  ShiftType['G動椅'],
  ShiftType['射頻'],
  ShiftType['磁波'],
  ShiftType['震波'],
];

export const TherapyRoles = [
  RoleType['系統管理者'],
  RoleType['院長'],
  RoleType['副院長'],
  RoleType['物理治療師組長'],
  RoleType['物理治療師'],
];

export const CoachRoles = [
  RoleType['店長'],
  RoleType['副店長'],
  RoleType['教練組長'],
  RoleType['教練'],
];

type TabName = typeof TabNames[number];
export interface Type {
  // identifier: typeof ShiftTypeConst[keyof typeof ShiftTypeConst];
  identifier: ShiftType;
  name: string;
  label: string;
  tabs: TabName[];
  canUsePoint: boolean;
  calcAmount: (usePoint?: boolean) => number;
  spaceType: SpaceType;
  showInOptions: boolean;
  pointType?: number;
  canEditTime: boolean;
  hideInOptions?: boolean;
  roles: number[];
  selectLabel: '治療師' | '教練';
}

export const Types: Record<TypeName, Type> = {
  physicalConsultation: {
    identifier: ShiftType['物理諮詢門診'],
    name: 'physicalConsultation',
    label: '物理諮詢門診',
    tabs: ['clientInfo', 'physicalConsultation', 'magneticWaveRecord', 'consultationAttachment', 'addOnPrice', 'bodyAnalysis', 'memo', 'pointsGroup'],
    canUsePoint: false,
    calcAmount: () => 200,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
    canEditTime: false,
    hideInOptions: true, // #311 [後台] 暫時移除物理諮詢門診 https://www.notion.so/enginelin/311-1106ce59243c8093a7a2c19f099eb8f6?pvs=4
    roles: TherapyRoles,
    selectLabel: '治療師',
  },
  physicalTherapy: {
    identifier: ShiftType['物理治療門診'],
    name: 'physicalTherapy',
    label: '物理治療門診',
    tabs: ['clientInfo', 'medicalRecord', 'magneticWaveRecord', 'addOnPrice', 'bodyAnalysis', 'memo', 'pointsGroup'],
    canUsePoint: true,
    calcAmount: usePoint => usePoint ? 1 : 2000,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
    pointType: PointTypes['物理治療'],
    canEditTime: true,
    roles: TherapyRoles,
    selectLabel: '治療師',
  },
  footPressure: {
    identifier: ShiftType['足壓門診'],
    name: 'footPressure',
    label: '足壓門診',
    tabs: ['clientInfo', 'footPressure', 'bodyAnalysis', 'addOnPrice', 'memo', 'pointsGroup'],
    canUsePoint: false,
    calcAmount: () => 2000,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
    canEditTime: true,
    roles: TherapyRoles,
    selectLabel: '治療師',
  },
  nutrition: {
    identifier: ShiftType['營養門診'],
    name: 'nutrition',
    label: '營養門診',
    tabs: ['clientInfo', 'nutritionClinic', 'bodyAnalysis', 'addOnPrice', 'memo', 'pointsGroup'],
    canUsePoint: true,
    calcAmount: usePoint => usePoint ? 1 : 2000,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
    canEditTime: true,
    roles: TherapyRoles,
    selectLabel: '治療師',
  },
  sleep: {
    identifier: ShiftType['睡眠門診'],
    name: 'sleep',
    label: '睡眠門診',
    tabs: ['clientInfo', 'sleepClinic', 'bodyAnalysis', 'addOnPrice', 'memo', 'pointsGroup'],
    canUsePoint: false,
    calcAmount: () => 2000,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
    canEditTime: true,
    roles: TherapyRoles,
    selectLabel: '治療師',
  },
  deanConsultation: {
    identifier: ShiftType['院長評估門診'],
    name: 'deanConsultation',
    label: '院長評估門診',
    tabs: ['clientInfo', 'physicalConsultation', 'magneticWaveRecord', 'consultationAttachment', 'addOnPrice', 'bodyAnalysis', 'memo', 'pointsGroup'],
    canUsePoint: false,
    calcAmount: () => 699,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
    canEditTime: true,
    roles: TherapyRoles,
    selectLabel: '治療師',
  },
  deanTherapy: {
    identifier: ShiftType['院長物理治療'],
    name: 'deanTherapy',
    label: '院長物理治療',
    tabs: ['clientInfo', 'medicalRecord', 'magneticWaveRecord', 'addOnPrice', 'bodyAnalysis', 'memo', 'pointsGroup'],
    canUsePoint: true,
    calcAmount: usePoint => usePoint ? 1 : 3000,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
    pointType: PointTypes['院長物理治療'],
    canEditTime: true,
    roles: TherapyRoles,
    selectLabel: '治療師',
  },
  nutritionConsultation: {
    identifier: ShiftType['營養諮詢門診'],
    name: 'nutritionConsultation',
    label: '營養諮詢門診',
    tabs: ['clientInfo', 'nutritionClinic', 'bodyAnalysis', 'addOnPrice', 'memo', 'pointsGroup'],
    canUsePoint: false,
    calcAmount: () => 499,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
    pointType: PointTypes['營養'],
    canEditTime: true,
    roles: TherapyRoles,
    selectLabel: '治療師',
  },
  oneOnOne: {
    identifier: ShiftType['教練課'],
    name: 'coachClass',
    label: '教練課',
    tabs: ['clientInfo', 'trainingPlan', 'bodyAnalysis', 'memo', 'pointsGroup'],
    canUsePoint: true,
    calcAmount: () => 1650, // to be confirmed
    spaceType: SpaceType['運動場館'],
    showInOptions: true,
    pointType: PointTypes['教練課'],
    canEditTime: true,
    roles: CoachRoles,
    selectLabel: '教練',
  },
  sports: {
    identifier: ShiftType['運動諮詢'],
    name: 'sportConsultation',
    label: '運動諮詢',
    tabs: ['clientInfo', 'sportClinic', 'bodyAnalysis', 'memo', 'pointsGroup'],
    canUsePoint: false,
    calcAmount: () => 200, // to be confirmed
    spaceType: SpaceType['運動場館'],
    showInOptions: true,
    canEditTime: true,
    roles: CoachRoles,
    selectLabel: '教練',
  },
  group: {
    identifier: ShiftType['團課'],
    name: 'groupClass',
    label: '團課',
    tabs: ['clientInfo', 'groupClass', 'pointsGroup'],
    canUsePoint: false,
    calcAmount: () => 1650, // to be confirmed
    spaceType: SpaceType['運動場館'],
    showInOptions: false,
    canEditTime: false,
    roles: CoachRoles,
    selectLabel: '教練',
  },
  physicalTrial: {
    identifier: ShiftType['物理治療體驗門診'],
    name: 'physicalTrial',
    label: '物理治療體驗門診',
    tabs: ['clientInfo', 'physicalConsultation', 'magneticWaveRecord', 'consultationAttachment', 'addOnPrice', 'bodyAnalysis', 'memo', 'pointsGroup'],
    canUsePoint: false,
    calcAmount: () => 200,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
    canEditTime: true,
    roles: TherapyRoles,
    selectLabel: '治療師',
  },
  InternshipClinic: {
    identifier: ShiftType['新人實習門診'],
    name: 'physicalTherapy',
    label: '新人實習門診',
    tabs: ['clientInfo', 'medicalRecord', 'bodyAnalysis', 'addOnPrice', 'memo', 'pointsGroup'],
    canUsePoint: false,
    calcAmount: () => 200,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
    canEditTime: true,
    roles: TherapyRoles,
    selectLabel: '治療師',
  },
  shockWave: {
    identifier: ShiftType['震波'],
    name: 'shockWave',
    label: '震波儀器治療',
    tabs: ['clientInfo', 'medicalRecord', 'addOnPrice', 'bodyAnalysis', 'memo', 'pointsGroup'],
    canUsePoint: true,
    calcAmount: () => 2000,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
    canEditTime: true,
    roles: TherapyRoles,
    selectLabel: '治療師',
    pointType: PointTypes['震波'],
  },
  radioFrequency: {
    identifier: ShiftType['射頻'],
    name: 'radioFrequency',
    label: '射頻儀器治療',
    tabs: ['clientInfo', 'medicalRecord', 'addOnPrice', 'bodyAnalysis', 'memo', 'pointsGroup'],
    canUsePoint: true,
    calcAmount: () => 2000,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
    canEditTime: true,
    roles: TherapyRoles,
    selectLabel: '治療師',
    pointType: PointTypes['射頻'],
  },
  magneticWave: {
    identifier: ShiftType['磁波'],
    name: 'magneticWave',
    label: '磁波儀器治療',
    tabs: ['clientInfo', 'magneticWaveRecord', 'addOnPrice', 'bodyAnalysis', 'memo', 'pointsGroup'],
    canUsePoint: true,
    calcAmount: () => 2000,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
    canEditTime: true,
    roles: TherapyRoles,
    selectLabel: '治療師',
    pointType: PointTypes['磁波'],
  },
  GChair: {
    identifier: ShiftType['G動椅'],
    name: 'GChair',
    label: 'G動椅儀器治療',
    tabs: ['clientInfo', 'gChairRecord', 'addOnPrice', 'bodyAnalysis', 'memo', 'pointsGroup'],
    canUsePoint: true,
    calcAmount: () => 2000,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
    canEditTime: true,
    roles: TherapyRoles,
    selectLabel: '治療師',
    pointType: PointTypes['G動椅'],
  },
  familyAssessment: {
    identifier: ShiftType['家庭評估門診'],
    name: 'familyAssessment',
    label: '家庭評估門診',
    tabs: ['clientInfo', 'medicalRecord', 'magneticWaveRecord', 'addOnPrice', 'bodyAnalysis', 'memo', 'pointsGroup'],
    canUsePoint: false,
    calcAmount: usePoint => usePoint ? 1 : 2000,
    spaceType: SpaceType['物理診所'],
    showInOptions: true,
    canEditTime: true,
    roles: TherapyRoles,
    selectLabel: '治療師',
  },
};

export const pointsGroupOptions = Object.keys(PointTypes).slice(8, 17).map(group => ({ label: group, value: PointTypes[group as keyof typeof PointTypes] }));

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

// 儀器
export enum MachineTypes {
  震波儀器治療 = 1,
  射頻儀器治療 = 2,
  磁波儀器治療 = 3,
  G動椅儀器治療 = 4,
}

// 可加購項目
export enum AddOnServiceTypes {
  震波 = 14,
  射頻 = 15,
  磁波 = 16,
}
