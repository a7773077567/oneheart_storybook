import { api } from '@/utils/api';
import type { PaymentTypes, PointTypes } from '@/const/general';
import type { Client } from './clientManagement';

export interface PointsGroup {
  id: number;
  name: string;
  memberClients: Pick<Client, 'id' | 'name' | 'phone'>[];
  adminClient: Pick<Client, 'id' | 'name' | 'phone'>;
  points: number;
  type: PointTypes;
}

export interface CreateGroupField {
  type: PointTypes;
  name: string;
  adminClientId: number;
  memberClientIds: number[];
}

export interface TopupDetail {
  clientId: number;
  clientGroupId: number;
  plan: string;
  paidPointGained: number;
  giftPointGained: number;
  amount: number;
  payMethod: PaymentTypes;
  authorisationCode: string | null; // 信用卡授權碼，如果payMethod!=信用卡，此欄位必為null
  receiptNumber: string | null; // 信用卡簽單號，如果payMethod!=信用卡，此欄位必為null
}

export type EditGroupField = Pick<CreateGroupField, 'name' | 'memberClientIds'>;

// 取得客戶堂數群組
export async function getClientPointGroup(clientId: number) {
  const { data } = await api.get<PointsGroup[]>(`/clients/${clientId}/clientGroups`);
  return data;
}

// 建立堂數群組
export async function createPointGroup(param: CreateGroupField) {
  await api.post(`/clientGroups`, param);
}

// 更新堂數群組
export async function updatePointGroup(clientGroupId: number, param: EditGroupField) {
  await api.put(`/clientGroups/${clientGroupId}`, param);
}

// 刪除堂數群組
export async function deletePointGroup(clientGroupId: number) {
  await api.delete(`/clientGroups/${clientGroupId}`);
}

export interface GainPoint {
  clientId: number;
  clientGroupId: number;
  plan: string;
  paidPointGained: number;
  giftPointGained: number;
  amount: number;
  multiChannelPay: {
    payMethod: number;
    amount: number | null;
    authorisationCode: string | null;
    receiptNumber: string | null;
    details: string;
  }[];
  contractDottedsignTaskId: string;
}
// 儲值堂數
export async function gainPoint(param: GainPoint) {
  await api.post('clientGroups/gainPoint', param);
}

export type RefundPoint = Pick<GainPoint, 'clientId' | 'clientGroupId' | 'amount' | 'multiChannelPay'>;
// 退還堂數
export async function refundPoint(param: RefundPoint) {
  await api.post('clientGroups/refundPoint', param);
}
