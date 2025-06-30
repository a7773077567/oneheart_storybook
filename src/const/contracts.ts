import { MachineTypes, ShiftType } from './general';
import { ContractTypes } from '@/api';

export const MachineContractMapping: Record<MachineTypes, { name: string; contractType: ContractTypes } > = {
  [MachineTypes['震波儀器治療']]: { name: '聚焦式震波療程同意書', contractType: ContractTypes['聚焦式震波療程同意書(新版)'] },
  [MachineTypes['磁波儀器治療']]: { name: 'SIS超磁場治療儀療程前注意事項', contractType: ContractTypes['SIS超磁場治療儀療程前注意事項(新版)'] },
  [MachineTypes['射頻儀器治療']]: { name: '射頻儀器治療同意書', contractType: ContractTypes['射頻儀器治療同意書(新版)'] },
  [MachineTypes['G動椅儀器治療']]: { name: 'G動椅儀器治療同意書', contractType: ContractTypes['G動椅儀器治療同意書(新版)'] },
};
