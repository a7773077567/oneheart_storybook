import type { User } from '@/api/user';
import { fetchUsers } from '@/api/user';
import { type GroupShiftTemplate, type ShiftTemplate, type UserShift, type UserShiftsGet, fetchGroupShiftTemplates, fetchShiftTemplates, fetchUserShift, fetchUserShifts } from '@/api/shift';
import { defineStore } from 'pinia';

interface State {
  shiftTemplates: ShiftTemplate[];
  targetShiftTemplate: ShiftTemplate | null;
  users: User[];
  userShifts: UserShift[];
  targetUserShift: UserShift | null;
  groupShiftTemplates: GroupShiftTemplate[];
}

export const useShiftStore = defineStore('shift', {
  state: (): State => ({
    shiftTemplates: [],
    targetShiftTemplate: null,
    users: [],
    userShifts: [],
    targetUserShift: null,
    groupShiftTemplates: [],
  }),
  getters: {

  },
  actions: {
    async getShiftTemplates() {
      const data = await fetchShiftTemplates();
      this.shiftTemplates = data;
    },
    async getUsers(spaceIds: number[]) {
      const data = await fetchUsers(spaceIds);
      this.users = data;
    },
    async getUserShifts(params: UserShiftsGet) {
      const data = await fetchUserShifts(params);
      this.userShifts = data;
    },
    async getUserShift(userShiftId: number) {
      const data = await fetchUserShift(userShiftId);
      this.targetUserShift = data;
    },
    // ========== Group related ==========
    async getGroupShiftTemplates() {
      const data = await fetchGroupShiftTemplates();
      this.groupShiftTemplates = data;
    },

  },
});
