import { getDate } from '@/utils/date';

export function getMonthTabs() {
  return ['當前月', '上個月', '上上個月'].map((item, idx) => {
    return {
      name: `${getDate(0 - idx, 'YYYY/MM')}`,
      label: `${getDate(0 - idx)} 月`,
    };
  });
}
