import type { ClientSchedule, UserInProgressClientSchedule } from '@/api';
import { type UserInProgressClientSchedulesParams, fetchUserInProgressClientSchedules } from '@/api/dashboard';
import { ShiftType } from '@/const/general';
import { defineStore } from 'pinia';

interface State {
  userInProgressClientSchedules: UserInProgressClientSchedule[];
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
          spaceName: userShift.space.name,
        };
      });
    },
  },
  actions: {
    async getUserInProgressClientSchedules(params: UserInProgressClientSchedulesParams) {
      const data = await fetchUserInProgressClientSchedules(params);
      this.userInProgressClientSchedules = data;
    },
  },
});
