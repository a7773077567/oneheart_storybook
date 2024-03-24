import { defineStore } from 'pinia';
import { type User, fetchUserInfo } from '@/api/user';

interface State {
  userInfo: User | null;
  currentSpace: number | null;
}

export const useUserStore = defineStore('user', {
  state: (): State => {
    return {
      userInfo: null,
      currentSpace: null,
    };
  },
  getters: {

  },
  actions: {
    async getUserInfo() {
      const userInfo = await fetchUserInfo();
      this.userInfo = userInfo;
    },
  },
});
