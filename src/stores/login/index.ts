import { defineStore } from 'pinia';

import type { LoginData, LoginRes, UserInfoRes } from './types';

// import { api } from '@/utils/api';
import { login } from '@/api/user';
import { setCookie } from '@/utils/helpers';

type LoginPayload = Parameters<typeof login>[0];

export const useLoginStore = defineStore('LoginStore', {
  state() {
    return {
      userInfo: null as UserInfoRes | null,
    };
  },
  getters: {

  },
  actions: {
    async login(payload: LoginPayload) {
      // const { data } = await api.post<LoginRes, LoginData>('user/login', payload);
      const token = await login(payload);
      setCookie('token', token);
    },
    // async getUserInfo() {
    //   const { data } = await api.get<UserInfoRes>('user/info');
    //   this.userInfo = data;
    //   return data;
    // },
  },
});
