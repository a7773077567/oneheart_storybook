import { api } from '@/utils/api';
import type { PointTypes } from '@/const/general';
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

export type EditGroupField = Pick<CreateGroupField, 'name' | 'memberClientIds'>;

// 取得客戶點數群組
export async function getClientPointGroup(clientId: number) {
  const { data } = await api.get<PointsGroup[]>(`/clients/${clientId}/clientGroups`);
  return data;
}

// 建立點數群組
export async function createPointGroup(param: CreateGroupField) {
  await api.post(`/clientGroups`, param);
}

// 更新點數群組
export async function updatePointGroup(clientGroupId: number, param: EditGroupField) {
  await api.put(`/clientGroups/${clientGroupId}`, param);
}

// 刪除點數群組
export async function deletePointGroup(clientGroupId: number) {
  await api.delete(`/clientGroups/${clientGroupId}`);
}
