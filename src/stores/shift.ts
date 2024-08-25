import type { User } from '@/api/user';
import { fetchUsers } from '@/api/user';
import { fetchAvailableClassesForGym, fetchGroupShiftTemplates, fetchShiftTemplates, fetchUserShift, fetchUserShifts } from '@/api/shift';
import type { AvailableClassesForGym, GroupShiftTemplate, ShiftTemplate, UserShift, UserShiftsGet } from '@/api/shift';
import { defineStore } from 'pinia';
import { useUserStore } from './user';
import { SpaceType, Types } from '@/const/general';

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
    spaceShiftOptions() {
      const userStore = useUserStore();
      if (userStore.currentSpace?.type === SpaceType['綜合']) {
        return Object.values(Types).map(({ label, identifier }) => ({ label, value: identifier }));
      }

      return Object.values(Types).filter(({ spaceType, showInOptions }) => spaceType === userStore.currentSpace?.type && showInOptions).map(({ label, identifier }) => ({
        label,
        value: identifier,
      }));
    },
    activeUsers: (state) => {
      const { users } = state;
      // todo, 櫃檯人員改用 enum
      return users.filter(({ isSuspended, role }) => !isSuspended && role.name !== '櫃檯').map(member => ({
        label: member.name,
        value: member.id,
        ...member,
      }));
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
