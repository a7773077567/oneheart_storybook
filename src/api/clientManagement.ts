import { api } from '@/utils/api';
import type { User } from './user';

export interface Memo {
  id: number;
  fromUserShiftType: number;
  fromUser: User;
  toUserShiftType: number; // 留言對象排班類別
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
