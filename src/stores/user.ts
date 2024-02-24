import { defineStore } from 'pinia';
import { type LoginReq, type UserInfoRes, getUserInfo, login } from '@/api/user';
import { setCookie } from '@/utils/helpers';

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
    async login(payload: LoginReq) {
      const token = await login(payload);
      setCookie('token', token);
    },
    async getUserInfo() {
      const userInfo = await getUserInfo();
      this.userInfo = userInfo;
    },
  },
});
