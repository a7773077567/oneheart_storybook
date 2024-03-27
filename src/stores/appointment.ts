import { defineStore } from 'pinia';
import { fetchClients, fetchTherapyTypes } from '@/api/appointment';
import type { BookingSchema, Client, ClientsGetParams } from '@/api/appointment';
import { fetchUsers } from '@/api/user';
import type { User } from '@/api/user';
import { fetchUserShift } from '@/api/shift';
import type { UserShift } from '@/api/shift';

interface State {
  therapyTypes: string[];
  users: User[];
  bookingQuery: BookingSchema;
  querySent: boolean;
  employees: any[];
  clientPhone: string;
  clients: Client[];
  targetClient: Client | null;
  targetUserShiftId: number | null;
  targetUserShift: UserShift | null;
}

export const useAppointmentStore = defineStore('appointment', {
  state: (): State => ({
    therapyTypes: [],
    users: [],
    bookingQuery: {
      therapyType: null,
      therapist: null,
      date: '',
      endTime: '',
      startTime: '',
    },
    querySent: false,
    employees: [],
    clientPhone: '',
    clients: [],
    targetClient: null,
    targetUserShiftId: null,
    targetUserShift: null,
  }),
  getters: {
    therapyTypeOptions(state) {
      const { therapyTypes } = state;
      return therapyTypes.map((item, idx) => ({
        label: item,
        value: idx,
      }));
    },
    userOptions(state) {
      const { users } = state;
      return users.map(({ name, id }) => ({
        label: name,
        value: id,
      }));
    },
    clientQuery(state): ClientsGetParams {
      return {
        phones: [state.clientPhone],
      };
    },

  },
  actions: {
    async getTherapyTypes() {
      const { therapyTypes } = await fetchTherapyTypes();
      this.therapyTypes = therapyTypes;
    },
    async getUsers(spaceIds: number[]) {
      const data = await fetchUsers(spaceIds);
      this.users = data;
    },
    async getClients() {
      const data = await fetchClients(this.clientQuery);
      this.clients = data;
    },
    async getUserShift() {
      const data = await fetchUserShift(1);
      this.targetUserShift = data;
    },
  },
});
