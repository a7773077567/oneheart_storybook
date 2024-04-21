import { defineStore } from 'pinia';
import { type User, fetchUserInfo, fetchUsers } from '@/api/user';

interface State {
  currentSpace: number | null;
  userInfo: User | null;
  users: User[];
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
  },
});
