import type { Duration } from '@/api';
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import duration, { type DurationUnitType } from 'dayjs/plugin/duration';

dayjs.extend(objectSupport);
dayjs.extend(duration);
dayjs.extend(quarterOfYear);

export function getWeekDay(weekDay: number) {
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return weekDays[weekDay];
}

export function getDurationLabel(startTime: string, endTime: string, isNotAvailableTime?: boolean) {
  const [startHr] = startTime.split(':');
  const [endHr] = endTime.split(':');

  if (!isNotAvailableTime) {
    return `${amOrPm(+startHr)} ${startTime} - ${amOrPm(+endHr)} ${endTime}`;
  }

  return `${startTime} - ${endTime}`;
}

export function getTimeDate(time: string) {
  const [hr, min] = time.split(':');
  return dayjs({ h: hr, m: min });
}

export function amOrPm(hr: number) {
  return hr >= 12 ? '下午' : '上午';
}

// HH:mm & HH:mm -> [H, m, H, m]
export function splitTime({ startTime, endTime }: Duration) {
  const timeArray = [...startTime.split(':'), ...endTime.split(':')];
  return timeArray.map(time => +time);
}

// [H,m, H, m] -> HH:mm & HH:mm
export function combineTime(duration: number[]): Duration {
  const startTime = dayjs({ h: duration[0], m: duration[1] });
  const endTime = dayjs({ h: duration[2], m: duration[3] });
  return {
    startTime: startTime.format('HH:mm'),
    endTime: endTime.format('HH:mm'),
  };
}

export function getDuration(startTime: string, endTime: string, unit: dayjs.QUnitType | dayjs.OpUnitType) {
  const [startHr, startMin] = startTime.split(':');
  const [endHr, endMin] = endTime.split(':');
  const startTimeDate = dayjs({ h: +startHr, m: +startMin });
  const endTimeDate = dayjs({ h: +endHr, m: +endMin });
  return endTimeDate.diff(startTimeDate, unit);
}

export function reduceMinsToHrs<T extends Record<string, any>, K extends keyof T>(target: T[], key: K) {
  const amount = target.reduce((acc, item) => acc + item[key], 0);
  return minsToHrs(amount);
}

export function minsToHrs(val: number) {
  return dayjs.duration(val, 'm').asHours();
}
