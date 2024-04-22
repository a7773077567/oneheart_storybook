import { defineStore } from 'pinia';
import { fetchAvailable, fetchAvailableRearranged, fetchClientSchedule, fetchClientSchedulesHistories, fetchClientSchedulesInProgress, fetchClientSchedulesNotStarted, fetchClients } from '@/api/appointment';
import type { Available, AvailableRearrangedReq, AvailableReq, Client, ClientSchedule, ClientSchedulesHistoriesReq, ClientSchedulesNotStartedReq, ClientsGetParams } from '@/api/appointment';
import { fetchUsers } from '@/api/user';
import type { User } from '@/api/user';
import { fetchUserShift } from '@/api/shift';
import type { UserShift } from '@/api/shift';
import { getTimeDate } from '@/utils/date';

interface State {
  users: User[];
  querySent: boolean;
  availableQuery: AvailableReq | null;
  clientPhone: string;
  clients: Client[];
  targetClient: Client | null;
  targetUserShift: UserShift | null;
  available: Available[];
  targetAvailable: Available | null;
  clientSchedulesNotStarted: ClientSchedule[];
  clientSchedulesNotStartedQuery: ClientSchedulesNotStartedReq | null;
  targetClientScheduleNotStarted: ClientSchedule | null;
  rearrangeQuery: AvailableRearrangedReq | null;
  rearrangeMode: boolean;
  clientSchedulesHistories: ClientSchedule[];
  clientSchedulesHistoriesQuery: ClientSchedulesHistoriesReq | null;
  clientSchedulesInProgress: ClientSchedule[];
  // targetAppointment: ClientScheduleDetail | null;
  targetClientSchedule: ClientSchedule | null;
}

export const useAppointmentStore = defineStore('appointment', {
  state: (): State => ({
    users: [],
    querySent: false,
    availableQuery: null,
    clientPhone: '',
    clients: [],
    targetClient: null,
    targetUserShift: null,
    available: [],
    targetAvailable: null,
    clientSchedulesNotStarted: [],
    clientSchedulesNotStartedQuery: null,
    targetClientScheduleNotStarted: null,
    rearrangeQuery: null,
    rearrangeMode: false,
    clientSchedulesHistories: [],
    clientSchedulesHistoriesQuery: null,
    clientSchedulesInProgress: [],
    // targetAppointment: null,
    targetClientSchedule: null,
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
        nameOrPhone: state.clientPhone,
      };
    },
    queryCalendarStyle(state) {
      const { availableQuery, rearrangeQuery, rearrangeMode } = state;
      if (availableQuery === null && rearrangeQuery === null) {
        return {};
      }
      const targetQuery = rearrangeMode ? rearrangeQuery : availableQuery;
      const { startTime, endTime } = targetQuery!;
      const start = getTimeDate(startTime);
      const end = getTimeDate(endTime);
      const count = Math.ceil(end.diff(start, 'm') / 60);

      return {
        start: start.get('h'),
        count,
      };
    },
    // targetAppointmentType: state => state?.targetAppointment?.userShift?.type,
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
      this.querySent = false;
    },
    async getClientSchedulesNotStarted(params: ClientSchedulesNotStartedReq) {
      const data = await fetchClientSchedulesNotStarted(params);
      this.clientSchedulesNotStarted = data;
    },
    async getAvailableRearranged(params: AvailableRearrangedReq) {
      const data = await fetchAvailableRearranged(params);
      this.available = data;
    },
    resetClientSchedulesNotStartedState() {
      this.clientSchedulesNotStarted = [];
      this.clientSchedulesNotStartedQuery = null;
      this.targetClientScheduleNotStarted = null;
      this.rearrangeMode = false;
      this.rearrangeQuery = null;
      this.querySent = false;
    },
    async getClientSchedulesHistories(params: ClientSchedulesHistoriesReq) {
      const data = await fetchClientSchedulesHistories(params);
      this.clientSchedulesHistories = data;
    },
    resetClientSchedulesHistoriesState() {
      this.clientSchedulesHistories = [];
    },
    async getClientSchedulesInProgress(date: string) {
      const data = await fetchClientSchedulesInProgress(date);
      this.clientSchedulesInProgress = data;
    },
    // async getScheduleDetail(scheduleId: number) {
    //   this.targetAppointment = await fetchClientScheduleDetail(scheduleId);
    // },
    async getClientSchedule(clientScheduleId: number) {
      const data = await fetchClientSchedule(clientScheduleId);
      this.targetClientSchedule = data;
    },
  },
});
