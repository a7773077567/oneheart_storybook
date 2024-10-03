import type { ClientSchedule } from '@/api';
import { UserInProgressClientSchedules, type UserInProgressClientSchedulesParams } from '@/api/dashboard';
import { ShiftType } from '@/const/general';
import { defineStore } from 'pinia';

interface State {
  userInProgressClientSchedules: ClientSchedule[];
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): State => ({
    userInProgressClientSchedules: [],
  }),
  getters: {
    userPersonalSchedules(state: State) {
      return state.userInProgressClientSchedules.map((schedule) => {
        const { scheduleStartTime, scheduleEndTime, userShift, client, id, date } = schedule;
        return {
          scheduleId: id,
          typeName: ShiftType[userShift.type],
          clientName: client.name,
          clientPhone: client.phone,
          userName: userShift.user.name,
          time: `${scheduleStartTime}-${scheduleEndTime}`,
          date,
        };
      });
    },
  },
  actions: {
    async getUserInProgressClientSchedules(params: UserInProgressClientSchedulesParams) {
      const data = await UserInProgressClientSchedules(params);
      this.userInProgressClientSchedules = data;
    },
  },
});
