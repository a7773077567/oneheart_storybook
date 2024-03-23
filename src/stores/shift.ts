import { type ShiftTemplate, fetchShiftTemplates } from '@/api/shift';

import { defineStore } from 'pinia';

interface State {
  shiftTemplates: ShiftTemplate[];
  targetShift: ShiftTemplate | null;
}

export const useShiftStore = defineStore('shift', {
  state: (): State => ({
    shiftTemplates: [],
    targetShift: null,
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
