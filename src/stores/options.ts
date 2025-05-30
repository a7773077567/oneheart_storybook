import { defineStore } from 'pinia';
import { type MachineInfo, type Space, fetchSpaces, getMachineList } from '@/api';

// This store is used to fetch data that does not change frequently
interface State {
  machineList: MachineInfo[];
  spaceList: Space[];
}
export const useOptionStore = defineStore('option', {
  state: (): State => ({
    machineList: [],
    spaceList: [],
  }),
  getters: {
    spaceIds: state => state.spaceList.map(s => s.id),
  },
  actions: {
    getSpaceOptions() {
      Promise.allSettled([this.getMachineList(), this.getSpaceList()]);
    },
    async getMachineList() {
      this.machineList = await getMachineList();
    },
    async getSpaceList() {
      this.spaceList = await fetchSpaces();
    },
  },
});
