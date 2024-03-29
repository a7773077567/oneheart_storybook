import { defineStore } from 'pinia';
import { fetchAvailable, fetchClientSchedulesNotStarted, fetchClients } from '@/api/appointment';
import type { Available, AvailableReq, Client, ClientSchedule, ClientSchedulesNotStartedReq, ClientsGetParams } from '@/api/appointment';
import { fetchUsers } from '@/api/user';
import type { User } from '@/api/user';
import { fetchUserShift } from '@/api/shift';
import type { UserShift } from '@/api/shift';
import { getTimeDate } from '@/utils/date';

interface State {
  users: User[];
  querySent: boolean;
  // employees: any[];
  availableQuery: AvailableReq | null;
  clientPhone: string;
  clients: Client[];
  targetClient: Client | null;
  targetUserShift: UserShift | null;
  available: Available[];
  targetAvailable: Available | null;
  ClientSchedulesNotStarted: ClientSchedule[];
  ClientSchedulesNotStartedQuery: ClientSchedulesNotStartedReq | null;
}

export const useAppointmentStore = defineStore('appointment', {
  state: (): State => ({
    users: [],
    querySent: false,
    // employees: [],
    availableQuery: null,
    clientPhone: '',
    clients: [],
    targetClient: null,
    targetUserShift: null,
    available: [],
    targetAvailable: null,
    ClientSchedulesNotStarted: [],
    ClientSchedulesNotStartedQuery: null,
  }),
  getters: {
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
    queryCalendarStyle(state) {
      if (state.availableQuery === null) {
        return {};
      }
      const { startTime, endTime } = state.availableQuery;
      const start = getTimeDate(startTime);
      const end = getTimeDate(endTime);
      const count = Math.ceil(end.diff(start, 'm') / 60);

      return {
        start: start.get('h'),
        count,
      };
    },
  },
  actions: {
    async getUsers(spaceIds: number[]) {
      const data = await fetchUsers(spaceIds);
      this.users = data;
    },
    async getClients() {
      const data = await fetchClients(this.clientQuery);
      this.clients = data;
    },
    async getUserShift(userShiftId: number) {
      const data = await fetchUserShift(userShiftId);
      this.targetUserShift = data;
    },
    async getAvailable(params: AvailableReq) {
      const data = await fetchAvailable(params);
      this.available = data;
    },
    resetTargetAppointmentState() {
      this.clientPhone = '';
      this.clients = [];
      this.targetAvailable = null;
      this.targetClient = null;
    },
    resetAppointmentQueryState() {
      this.availableQuery = null;
      this.available = [];
    },
    async getClientSchedulesNotStarted(params: ClientSchedulesNotStartedReq) {
      const data = await fetchClientSchedulesNotStarted(params);
      this.ClientSchedulesNotStarted = data;
    },
  },
});
