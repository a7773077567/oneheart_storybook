import { defineStore } from 'pinia';
import { type MachineInfo, getMachineList } from '@/api';

// This store is used to fetch data that does not change frequently
interface State {
  machineList: MachineInfo[];
}
export const useOptionStore = defineStore('option', {
  state: (): State => ({
    machineList: [],
  }
  ),
  actions: {
    getSpaceOptions() {
      Promise.allSettled([this.getMachineList()]);
    },
    async getMachineList() {
      this.machineList = await getMachineList();
    },
  },
});
