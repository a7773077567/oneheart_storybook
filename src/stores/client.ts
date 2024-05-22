import { defineStore } from 'pinia';
import { type Client, getClientInfo } from '@/api';

interface State {
  targetClient: Client | null;
}

export const useClientStore = defineStore('client', {
  state: (): State => {
    return {
      targetClient: null,
    };
  },
  getters: {

  },
  actions: {
    async getClientInfo(clientId: string) {
      this.targetClient = await getClientInfo(clientId);
    },

  },
});
