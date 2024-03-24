import { defineStore } from 'pinia';
import { type BookingSchema, fetchTherapyTypes } from '@/api/appointment';
import { type User, fetchUsers } from '@/api/user';

interface State {
  therapyTypes: string[];
  users: User[];
  bookingQuery: BookingSchema;
  querySent: boolean;
  employees: any[];
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
  },
});
