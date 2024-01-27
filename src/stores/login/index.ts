import { defineStore } from 'pinia';
import type { LoginData, LoginRes, UserInfoRes } from './types';
import { api } from '@/utils/api';
import { setCookie } from '@/utils/helpers';

export const useLoginStore = defineStore('LoginStore', {
  state() {
    return {
      userInfo: null as UserInfoRes | null,
    };
  },
  getters: {

  },
  actions: {
    async login(payload: LoginData) {
      const { data } = await api.post<LoginRes, LoginData>('user/login', payload);
      setCookie('token', data.token);
    },
    async getUserInfo() {
      const { data } = await api.get<UserInfoRes>('user/info');
      this.userInfo = data;
      return data;
    },
  },
});
