import type { Duration } from '@/api';
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import duration, { type DurationUnitType } from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(objectSupport);
dayjs.extend(duration);
dayjs.extend(quarterOfYear);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

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

export function judgeTimeWithinDuration({ startTime, endTime, min, max }: { startTime?: string; endTime?: string; min: string; max: string }) {
  const start = startTime && getTimeDate(startTime);
  const end = endTime && getTimeDate(endTime);
  const _min = getTimeDate(min);
  const _max = getTimeDate(max);
  let result = [];

  if (start) {
    result.push(start.isSameOrAfter(_min));
  }
  if (end) {
    result.push(end.isSameOrBefore(_max));
  }
  if (start && end) {
    result.push(start.isSameOrBefore(end));
  }

  return result.every(r => !!r);
}

export function getMonthDifference(year: number, month: number): number {
  const inputDate = dayjs(`${year}-${month}-01`); // 將輸入的年、月轉為 dayjs 物件
  const currentDate = dayjs().startOf('month'); // 取得當前月份的第一天，確保比較準確

  return currentDate.diff(inputDate, 'month'); // 計算月份差異
}

// 根據當前月份取得偏移後的月份
export function getDate(offset: number, format?: string) {
  const date = offset < 0
    ? dayjs().subtract(Math.abs(offset), 'month')
    : dayjs().add(offset, 'month');

  return format
    ? date.format(format)
    : date.month() + 1;
}

export function isTimeDurationOverlap(duration1: Duration, duration2: Duration) {
  if (getTimeDate(duration1.endTime).isSameOrBefore(getTimeDate(duration2.startTime))) {
    return false;
  }
  if (getTimeDate(duration2.endTime).isSameOrBefore(getTimeDate(duration1.startTime))) {
    return false;
  }
  return true;
}
