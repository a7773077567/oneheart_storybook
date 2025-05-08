import { api } from '@/utils/api';
import { defineStore } from 'pinia';

export const useSalaryReportStore = defineStore('salaryReport', {
  state: () => ({
    isAuthenticated: false,
  }),
  getters: {
  },
  actions: {
    async authenticate(password: string) {
      // const { data } = await api.post('', { password });
      if (password === '123456') {
        return 'success';
      }

      return 'failed';
    },
  },
});
