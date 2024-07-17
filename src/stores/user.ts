import { defineStore } from 'pinia';
import { type User, fetchUser, fetchUserInfo, fetchUsers } from '@/api/user';

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
        const optionValue = user.role.id;
        if (set.has(optionValue)) {
          return acc;
        }
        set.add(optionValue);
        const option = {
          label: user.role.name,
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
      return state.userInfo?.spaces.find(space => space.id === state.currentSpaceId)!.type === 2;
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
