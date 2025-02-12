import type { AddOnServiceTypes } from '@/const/general';
import { api } from '@/utils/api';

export enum ContractTypes {
  儲值治療類合約 = 1,
  儲值運動類合約 = 2,
  物理治療初診就診須知 = 3,
  聚焦式震波療程同意書 = 4,
  SIS超磁場治療儀療程前注意事項 = 5,
  射頻儀器治療同意書 = 6,
  G動椅儀器治療同意書 = 7,
}

export interface ContractParam {
  redirectUrl: string;
  payloadJSONString: string;
  type: ContractTypes;
}

// 下載合約
export async function downloadContract(taskId: number) {
  const { data } = await api.get<string>(`/dottedSign/download-contract?${taskId}`);
  return data;
}

// 取得點點簽頁面
export async function getContractShareLink(params: ContractParam) {
  const { data } = await api.get<{ shareLink: string }>(`/dottedSign/shareLink`, { params });
  return data;
}

// 修改客戶就診須知
export async function updateClientFirstVisitContract({ clientId, clientScheduleId, firstVisitContractDottedsignTaskId }: { clientId: number; clientScheduleId: number; firstVisitContractDottedsignTaskId: number }) {
  await api.patch(`clients/${clientId}/update-firstVisitContract`, { clientScheduleId, firstVisitContractDottedsignTaskId });
}

// 修改排程獨立預約儀器合約
export async function updateIndependentMachineContract({ clientScheduleId, dottedsignTaskId }: { clientScheduleId: number; dottedsignTaskId: string }) {
  const { data } = await api.patch(`/clientSchedules/${clientScheduleId}/update-independentMachine-contract`, { dottedsignTaskId });
  return data;
}

// 更新儀器加購服務合約資料
export async function updateAddOnServiceContract({ clientScheduleId, contractTaskId, serviceType }: { clientScheduleId: number; contractTaskId: number; serviceType: AddOnServiceTypes }) {
  const { data } = await api.patch(`/clientSchedules/${clientScheduleId}/addOnService-contract`, {
    contractTaskId,
    serviceType,
    contractStatus: 'success',
  });
  return data;
}
