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

export type ClientAssociation = Pick<Client, 'id' | 'name' | 'phone' | 'gender' | 'identityType' | 'identityNumber' | 'birthDate'>;
export interface Client {
  address: string;
  associations: ClientAssociation[];
  birthDate: string;
  email: string | null;
  gender: string;
  howToKnowUs: string;
  id: number;
  identityType: number;
  identityNumber: string;
  lineUserId: string;
  isVerifiedBySMS: boolean;
  inBodyFiles: InbodyFile[];
  inBodyFileUrls: string[];
  introducer: string | null;
  name: string;
  note: string;
  phone: string;
}

export type ClientBasic = Pick<Client, 'name' | 'email' | 'phone'>;
export type ClientSettings = Pick<Client, 'name' | 'phone' | 'gender' | 'identityNumber' | 'birthDate' | 'address' | 'note'>;

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

export interface PurchaseRecord {
  amount: number;
  date: string;
  payMethod: number;
  spaceName: string | null;
  type: number;
  usedPoint: number | null;
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

// 更新客戶
export async function updateClient(clientId: string, data: Partial<ClientSettings>) {
  await api.patch(`clients/${clientId}`, data);
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
  await api.post(`clients/${clientId}/addInbodyFiles`, attachment);
}

// 取得 Inbody 上傳 url
export async function getInbodyUploadUrl(clientId: number) {
  const { data } = await api.get<UploadFileInfo>(`clients/${clientId}/inbodyFileWriteUrl`);
  return data;
}

// 取得客戶付款記錄
export async function getClientPayments(clientId: number) {
  const { data } = await api.get<PurchaseRecord[]>(`clients/${clientId}/payments`);
  return data;
}

/**
 * 更新客戶的介紹者
 */
export async function updateIntroducer(clientId: number, body: { introducerClientId: number }) {
  await api.patch(`clients/${clientId}/update-introducer`, body);
}
