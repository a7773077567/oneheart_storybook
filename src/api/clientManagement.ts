import { api } from '@/utils/api';
import type { User } from './user';
import type { ShiftType } from '@/const/general';
import type { PagingMeta } from '@/types/common';

export interface ClientsGetParams {
  nameOrPhone?: string;
  order?: 'ASC' | 'DESC';
  page?: number;
  take?: number;
}

export interface ClientAssociation {
  id: number;
  name: string;
  phone: string;
  identityType: number;
  identityNumber: string;
  birthDate: string;
}
export interface Client extends ClientAssociation {
  email: string;
  lineUserId: string;
  isVerifiedBySMS: boolean;
  associations: ClientAssociation[];
  inBodyFiles: InbodyFile[];
  inBodyFileUrls: string[];
}

export type ClientBasic = Pick<Client, 'name' | 'email' | 'phone'>;

interface InbodyFile {
  createdAt: string;
  fileName: string;
}

export interface Memo {
  id: number;
  fromUserShiftType: ShiftType;
  fromUser: User;
  toUserShiftType: ShiftType; // 留言對象排班類別
  content: string;
  createdAt: string;
  reply: Omit<Memo, 'id'>[];
}

export type NewMemo = {
  clientScheduleId: number;
} & Pick<Memo, 'content' | 'toUserShiftType'>;

export interface MemoReply {
  clientScheduleId: number;
  replyContent: string;
};

export interface UploadFileInfo {
  method: string;
  url: string;
  maxFileSizeInMB: number;
  fileName: string;
}

// 取得 memo
export async function getMemos(clientId: number) {
  const { data } = await api.get<Memo[]>(`clients/${clientId}/memos`);
  return data;
}

// 新增 memo
export async function addMemo(clientId: number, content: NewMemo) {
  const { data } = await api.post(`clients/${clientId}/memos`, content);
  return data;
}

// 新增 memo 回覆
export async function replyMemo({ clientId, memoId }: { clientId: number; memoId: number }, content: MemoReply) {
  const { data } = await api.patch(`clients/${clientId}/memos/${memoId}`, content);
  return data;
}

// 建立客戶
export async function createClient(params: ClientBasic) {
  await api.post('clients', params);
}

// 取得所有客戶
export async function fetchClients(params?: ClientsGetParams) {
  const { data, meta } = await api.get<Client[], PagingMeta>('clients', { params });
  return { data, meta };
}

// 取得單一客戶
export async function getClientInfo(clientId: number) {
  const { data } = await api.get<Client>(`clients/${clientId}`);
  return data;
}

// 上傳 Inbody
export async function uploadInbodyFile(clientId: number, attachment: { fileName: string }) {
  await api.post(`/clients/${clientId}/addInbodyFiles`, attachment);
}

// 取得 Inbody 上傳 url
export async function getInbodyUploadUrl(clientId: number) {
  const { data } = await api.get<UploadFileInfo>(`/clients/${clientId}/inbodyFileWriteUrl`);
  return data;
}
