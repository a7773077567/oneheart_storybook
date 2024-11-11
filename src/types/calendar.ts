export interface Timestamp {
  date: string;
  time: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number;
  doy: number;
  workweek: number;
  hasDay: boolean;
  hasTime: boolean;
  past: boolean;
  current: boolean;
  future: boolean;
  disabled: boolean;
  currentWeekday: boolean;
}

export interface ChangeParam {
  start: string;
  end: string;
  days: Timestamp[];
}

export interface ClickDateParam {
  event: PointerEvent;
  scope: {
    dayLabel: string;
    timestamp: Timestamp;
    outside: boolean;
    activeDate: boolean;
    selectedDate: boolean;
    miniMode: boolean;
    disabled: boolean;
  };
}

export interface DayScope {
  outside: boolean;
  timestamp: Timestamp;
  miniMode: boolean;
  activeDate: boolean;
  hasMonth: boolean;
  droppable: boolean;
  disabled: boolean;
}

export interface ClickDayParam {
  event: PointerEvent;
  scope: DayScope;
}

export interface HeadDayScope {
  activeDate: boolean;
  weekday: number;
  timestamp: Timestamp;
  days: Timestamp[];
  index: number;
  miniMode: boolean;
  droppable: boolean;
  disabled: boolean;
}
