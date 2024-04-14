import { defineStore } from 'pinia';
import { type User, fetchUserInfo, fetchUsers } from '@/api/user';

interface State {
  currentSpace: number | null;
  userInfo: User | null;
  users: User[];

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
