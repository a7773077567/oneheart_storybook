import { defineStore } from 'pinia';

interface State {
  data: string;
}

export const usePrintStore = defineStore('print', {
  state: (): State => ({
    data: '',
  }),
});
