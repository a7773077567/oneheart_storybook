import { type ShiftTemplate, fetchShiftTemplates } from '@/api/shift';

import { defineStore } from 'pinia';

interface State {
  shiftTemplates: ShiftTemplate[];
  targetShiftTemplate: ShiftTemplate | null;
}

export const useShiftStore = defineStore('shift', {
  state: (): State => ({
    shiftTemplates: [],
    targetShiftTemplate: null,
  }),
  getters: {

  },
  actions: {
    async getShiftTemplates() {
      const data = await fetchShiftTemplates();
      this.shiftTemplates = data;
    },
  },
});
