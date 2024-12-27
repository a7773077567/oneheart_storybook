import type { User } from '@/api/user';
import { RoleType, WorkState, fetchUsers } from '@/api/user';
import { fetchAvailableClassesForGym, fetchGroupShiftTemplates, fetchShiftTemplates, fetchUserShift, fetchUserShifts } from '@/api/shift';
import type { AvailableClassesForGym, GroupShiftTemplate, ShiftTemplate, UserShift, UserShiftsGet } from '@/api/shift';
import { defineStore } from 'pinia';
import { useUserStore } from './user';
import { SpaceType, Types } from '@/const/general';
import { sortDepTypes } from '@/utils/helpers';

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
      const types = sortDepTypes(Object.values(Types).filter(item => !item.hideInOptions), 'identifier');
      if (userStore.currentSpace?.type === SpaceType['綜合']) {
        return types.map(({ label, identifier }) => ({ label, value: identifier }));
      }

      return types.filter(({ spaceType, showInOptions }) => spaceType === userStore.currentSpace?.type && showInOptions).map(({ label, identifier }) => ({
        label,
        value: identifier,
      }));
    },
    activeUsers: (state) => {
      const { users } = state;
      users.filter(({ stateOfWork, role }) => {
        return stateOfWork !== WorkState['離職'] && role.type !== RoleType['櫃檯'];
      });

      return users.filter(({ stateOfWork, role }) => stateOfWork !== WorkState['離職'] && role.type !== RoleType['櫃檯']).map(member => ({
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
      const data = await fetchUsers({ spaceIds });
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
