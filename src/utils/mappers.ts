import { Types } from '@/const/general';
import dayjs from 'dayjs';

export function getType(identifier: number) {
  return Object.values(Types).find(item => item.identifier === identifier)?.label;
}

export function getDateLabel(date: string) {
  return dayjs(date).format('YYYY/MM/DD');
}
