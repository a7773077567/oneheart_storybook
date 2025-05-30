import { defineStore } from 'pinia';
import { AccountState, RoleType, type User, WorkState, fetchUser, fetchUserInfo, fetchUsers } from '@/api';
import { type PermissionEvents, RolePermissions } from '@/const/permission';

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
      const spaceType = state.userInfo?.spaces.find(space => space.id === state.currentSpaceId)?.type;
      return spaceType === 2 || spaceType === 3;
    },
    role(state): RoleType { return state.userInfo?.role.type ?? RoleType['系統管理者']; },
    isWillyAccount: state => import.meta.env.MODE === 'production' && state.userInfo?.id === 16,
    canI() {
      return (action: PermissionEvents): boolean => {
        // 權限特例，針對 willy 帳號開放
        if (action === 'VIEW_USER_SETTING' && this.isWillyAccount) {
          return true;
        }

        return !!RolePermissions[this.role][action];
      };
    },
    canRoleDo() {
      return (role: RoleType, action: PermissionEvents): boolean => {
        return !!RolePermissions[role][action];
      };
    },
    activeUsers(state) {
      if (state.users?.length === 0)
        return [];
      return state.users.filter(user => user.stateOfWork === WorkState['在職'] && user.state === AccountState['開通']).map(user => ({ label: user.name, value: user.id }));
    },
  },
  actions: {
    async getUserInfo() {
      const userInfo = await fetchUserInfo();
      this.userInfo = userInfo;
    },
    async getUsers() {
      const data = await fetchUsers({ spaceIds: [this.currentSpaceId!] });
      this.users = data;
    },
    async getUser(userId: number) {
      const data = await fetchUser(userId);
      this.targetUser = data;
    },
  },
});
