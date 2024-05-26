export const TherapyTypes = {
  physicalConsultation: '物理諮詢門診',
  physicalTherapy: '物理治療門診',
  footPressure: '足壓門診',
  nutrition: '營養門診',
  sleep: '睡眠門診',
  sports: '運科門診',
  // oneOnOne: '一對一教練課',
  // group: '團課',
};
type TypeName = keyof typeof TherapyTypes;

const TabNames = ['clientInfo', 'medicalRecord', 'bodyAnalysis', 'memo', 'physicalConsultation', 'consultationAttachment', 'trainingPlain', 'sportClinic', 'groupClass', 'nutritionClinic', 'footPressure', 'sleepClinic'] as const;
const TabLabels = ['客戶資料', '病歷單', '身體組成表', 'MEMO', '諮詢表', '附件', '運動訓練單', '運科門診', '團體課程單', '營養諮詢單', '足壓門診單', '睡眠門診單'] as const;
export const TabMap = new Map(TabNames.map((item, idx) => [item, TabLabels[idx]]));

export enum ShiftType {
  物理諮詢門診 = 1,
  物理治療門診 = 2,
  足壓門診 = 3,
  營養門診 = 4,
  睡眠門診 = 5,
  運科門診 = 6,
}

type TabName = typeof TabNames[number];
interface Type {
  identifier: number;
  name: string;
  label: string;
  tabs: TabName[];
}

export const Types: Record<TypeName, Type> = {
  physicalConsultation: {
    identifier: 1,
    name: 'physicalConsultation',
    label: '物理諮詢門診',
    tabs: ['clientInfo', 'physicalConsultation', 'consultationAttachment', 'bodyAnalysis', 'memo'],
  },
  physicalTherapy: {
    identifier: 2,
    name: 'physicalTherapy',
    label: '物理治療門診',
    tabs: ['clientInfo', 'medicalRecord', 'bodyAnalysis', 'memo'],
  },
  footPressure: {
    identifier: 3,
    name: 'footPressure',
    label: '足壓門診',
    tabs: ['clientInfo', 'footPressure', 'bodyAnalysis', 'memo'],
  },
  nutrition: {
    identifier: 4,
    name: 'nutrition',
    label: '營養門診',
    tabs: ['clientInfo', 'nutritionClinic', 'bodyAnalysis', 'memo'],
  },
  sleep: {
    identifier: 5,
    name: 'sleep',
    label: '睡眠門診',
    tabs: ['clientInfo', 'sleepClinic', 'bodyAnalysis', 'memo'],
  },
  sports: {
    identifier: 6,
    name: 'sports',
    label: '運科門診',
    tabs: ['clientInfo', 'sportClinic', 'bodyAnalysis', 'memo'],
  },
  // oneOnOne: {
  //   identifier: 7,
  //   name: 'oneOnOne',
  //   label: '一對一教練課',
  //   tabs: ['clientInfo', 'trainingPlain', 'bodyAnalysis', 'memo'],
  // },
  // group: {
  //   identifier: 8,
  //   name: 'group',
  //   label: '團課',
  //   tabs: ['clientInfo', 'groupClass'],
  // },
};

export const pointsGroup = {
  物理治療: 1,
  院長物理治療: 2,
  營養: 3,
} as const;

export const pointsGroupOptions = Object.keys(pointsGroup).map(group => ({ label: group, value: group }));
