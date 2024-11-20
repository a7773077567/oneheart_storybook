import { defineStore } from 'pinia';
import { RoleType, type User, fetchUser, fetchUserInfo, fetchUsers } from '@/api/user';

interface State {
  currentSpaceId: number | null;
  userInfo: User | null;
  users: User[];
  targetUser: User | null;
}

interface SelectOption {
  label: string;
  value: any;
}
export type PermissionEvents = 'READ_HANDOVER';

export const useUserStore = defineStore('user', {
  state: (): State => {
    return {
      currentSpaceId: null,
      userInfo: null,
      users: [],
      targetUser: null,
    };
  },
  getters: {
    userJobTitleOptions(state) {
      const set = new Set();

      return state.users.reduce((acc: SelectOption[], user) => {
        const optionValue = user?.role?.id;
        if (set.has(optionValue)) {
          return acc;
        }
        set.add(optionValue);
        const option = {
          label: user?.role?.name,
          value: optionValue,
        };
        acc.push(option);
        return acc;
      }, []);
    },
    currentSpace(state) {
      return state.userInfo?.spaces.find(space => space.id === state.currentSpaceId);
    },
    isGym(state) {
      const spaceType = state.userInfo?.spaces.find(space => space.id === state.currentSpaceId)!.type;
      return spaceType === 2 || spaceType === 3;
    },
    role(state): RoleType { return state.userInfo?.role.type ?? RoleType['系統管理者']; },
    canI() {
      return (action: PermissionEvents): boolean => {
        switch (action) {
          case 'READ_HANDOVER':
            return this.role === RoleType['系統管理者'] || this.role === RoleType['櫃檯'] || this.role === RoleType['店長'] || this.role === RoleType['副店長'] || this.role === RoleType['院長'] || this.role === RoleType['副院長'];
          default:
            return false;
        }
      };
    },
  },
  actions: {
    async getUserInfo() {
      const userInfo = await fetchUserInfo();
      this.userInfo = userInfo;
    },
    async getUsers() {
      const data = await fetchUsers([this.currentSpaceId!]);
      this.users = data;
    },
    async getUser(userId: number) {
      const data = await fetchUser(userId);
      this.targetUser = data;
    },
  },
});
