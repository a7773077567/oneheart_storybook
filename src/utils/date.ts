import dayjs from 'dayjs';

export function getWeekDay(weekDay: number) {
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return weekDays[weekDay];
}

export function getDurationLabel(duration: Record<string, any>, isUnavailable?: boolean) {
  const { startHr, startMin, endHr, endMin } = duration;
  const startTime = dayjs().set('h', startHr).set('m', startMin);
  const endTime = dayjs().set('h', endHr).set('m', endMin);
  if (!isUnavailable) {
    return `${amOrPm(startHr)}${startTime.format('hh:mm')}-${amOrPm(endHr)}${endTime.format('hh:mm')}`;
  }
  return `${startTime.format('HH:mm')}-${endTime.format('HH:mm')}`;

  function amOrPm(hr: number) {
    return hr >= 12 ? '下午' : '上午';
  }
}
