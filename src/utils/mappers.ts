import { type Type, Types } from '@/const/general';
import { AccountState, WorkState } from '@/api';
import dayjs from 'dayjs';

export function getType(identifier: number): Type | undefined {
  return Object.values(Types).find(item => item.identifier === identifier);
}

export function getTypeLabel(identifier: number) {
  return Object.values(Types).find(item => item.identifier === identifier)?.label;
}

export function getDateLabel(date: string) {
  return dayjs(date).format('YYYY/MM/DD');
}

// 顯示順序：離職 > 停權 > 未開通、開通
interface State {
  matched: boolean;
  label: keyof typeof AccountState | keyof typeof WorkState;
  color: string;
}
export function getUserAccountState({ stateOfWork, state }: { stateOfWork: WorkState; state: AccountState }): State {
  const stateList: State[] = [
    {
      label: '離職',
      matched: stateOfWork === WorkState['離職'],
      color: 'bg-surface-variant text-secondary',
    },
    {
      label: '停權',
      matched: stateOfWork === WorkState['停權'],
      color: 'bg-warning-container text-on-warning-container',
    },
    {
      label: '未開通',
      matched: stateOfWork === WorkState['在職'] && state === AccountState['未開通'],
      color: 'bg-error-16 text-error',
    },
    {
      label: '開通',
      matched: stateOfWork === WorkState['在職'] && state === AccountState['開通'],
      color: 'bg-primary-container text-primary',
    },
  ];

  return stateList.find(state => state.matched) ?? stateList[0];
}
