import { defineStore } from 'pinia';
import type { LoginData, LoginRes, UserInfoRes } from './types';
import { api } from '@/utils/api';

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
      const { data } = await api.post<LoginRes>('user/login', payload);
      console.log(data.token);
    },
    async getUserInfo() {
      const { data } = await api.get<UserInfoRes>('user/info');
      console.log(data.id);
    },
  },
});
