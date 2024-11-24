import { api } from '@/utils/api';

export enum ContractTypes {
  儲值治療類合約 = 1,
  儲值運動類合約 = 2,
  物理治療初診就診須知 = 3,
}

export interface ContractParam {
  redirectUrl: string;
  payloadJSONString: string;
  type: ContractTypes;
}

export async function downloadContract(taskId: number) {
  const { data } = await api.get<string>(`/dottedSign/download-contract?${taskId}`);
  return data;
}

// 取得點點簽頁面
export async function getContractShareLink(params: ContractParam) {
  const { data } = await api.get<{ shareLink: string }>(`/dottedSign/shareLink`, { params });
  return data;
}
