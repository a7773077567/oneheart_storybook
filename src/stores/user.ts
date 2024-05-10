import { defineStore } from 'pinia';
import { type User, fetchUser, fetchUserInfo, fetchUsers } from '@/api/user';

interface State {
  currentSpace: number | null;
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
      currentSpace: null,
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
  },
  actions: {
    async getUserInfo() {
      const userInfo = await fetchUserInfo();
      this.userInfo = userInfo;
    },
    async getUsers() {
      const data = await fetchUsers([this.currentSpace!]);
      this.users = data;
    },
    async getUser(userId: number) {
      const data = await fetchUser(userId);
      this.targetUser = data;
    },
  },
});
