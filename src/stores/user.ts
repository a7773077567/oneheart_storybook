import { defineStore } from 'pinia';
import { type UserInfoRes, getUserInfo } from '@/api/user';

interface State {
  userInfo: UserInfoRes | null;
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
      const userInfo = await getUserInfo();
      this.userInfo = userInfo;
    },
  },
});
