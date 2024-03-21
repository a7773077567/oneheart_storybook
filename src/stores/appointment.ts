import { defineStore } from 'pinia';
import { type BookingSchema, type Therapist, fetchTherapists, fetchTherapyTypes } from '@/api/appointment';
import type { Employee } from '@/api/shift';

interface State {
  therapyTypes: string[];
  therapists: Therapist[];
  bookingQuery: BookingSchema;
  querySent: boolean;
  employees: Employee[];
}

export const useAppointmentStore = defineStore('appointment', {
  state: (): State => ({
    therapyTypes: [],
    therapists: [],
    bookingQuery: {
      therapyType: null,
      date: null,
      endTime: null,
      startTime: null,
      therapist: null,
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
    therapistOptions(state) {
      const { therapists } = state;
      return therapists.map(({ name, id }) => ({
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
    async getTherapists(typeId: number) {
      const { therapists } = await fetchTherapists(typeId);
      this.therapists = therapists;
    },
  },
});
