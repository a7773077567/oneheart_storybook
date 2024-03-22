import { defineStore } from 'pinia';
import { type UserInfo, fetchUserInfo } from '@/api/user';

interface State {
  userInfo: UserInfo | null;
}

export const useUserStore = defineStore('user', {
  state: (): State => {
    return {
      userInfo: null,
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
