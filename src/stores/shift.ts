import type { User } from '@/api/user';
import { fetchUsers } from '@/api/user';
import { fetchAvailableClassesForGym, fetchGroupShiftTemplates, fetchShiftTemplates, fetchUserShift, fetchUserShifts } from '@/api/shift';
import type { AvailableClassesForGym, GroupShiftTemplate, ShiftTemplate, UserShift, UserShiftsGet } from '@/api/shift';
import { defineStore } from 'pinia';

interface State {
  shiftTemplates: ShiftTemplate[];
  targetShiftTemplate: ShiftTemplate | null;
  users: User[];
  userShifts: UserShift[];
  targetUserShift: UserShift | null;
  groupShiftTemplates: GroupShiftTemplate[];
  availableClassesForGym: AvailableClassesForGym | null;
}

export const useShiftStore = defineStore('shift', {
  state: (): State => ({
    shiftTemplates: [],
    targetShiftTemplate: null,
    users: [],
    userShifts: [],
    targetUserShift: null,
    groupShiftTemplates: [],
    availableClassesForGym: null,
  }),
  getters: {
    shiftTemplatesForGym(state) {
      if (state.availableClassesForGym === null) {
        return [];
      }
      const { shiftTemplates, groupClasses } = state.availableClassesForGym;
      return [...shiftTemplates, ...groupClasses];
    },
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
    async getAvailableClassesForGym() {
      const data = await fetchAvailableClassesForGym();
      this.availableClassesForGym = data;
    },
  },
});
