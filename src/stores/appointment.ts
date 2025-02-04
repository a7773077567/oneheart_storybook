import { defineStore } from 'pinia';
import { fetchAddOnHistoryRecords, fetchAvailable, fetchAvailableRearranged, fetchClientGroup, fetchClientSchedule, fetchClientSchedulesHistories, fetchClientSchedulesInProgress, fetchClientSchedulesNotStarted, fetchClients, fetchHistoryChiefComplaints, fetchHistoryRecords, getMachineScheduleInprogress, getUploadS3Url, upload2awsS3 } from '@/api';
import type { Available, AvailableRearrangedReq, AvailableReq, Client, ClientGroup, ClientSchedule, ClientScheduleDetail, ClientSchedulesHistoriesReq, ClientSchedulesNotStartedReq, ClientsGetParams, HistoryChiefComplaint, HistoryRecord, MachineSchedule } from '@/api';
import { RoleType, WorkState, fetchUsers } from '@/api/user';
import type { User } from '@/api/user';
import { fetchUserShift, fetchUserShifts } from '@/api/shift';
import type { UserShift, UserShiftsGet } from '@/api/shift';
import { getTimeDate } from '@/utils/date';
import { ScheduleState } from '@/const/appointment';
import { useUserStore } from './user';
import { type AddOnServiceTypes, MachineShifts, ShiftType } from '@/const/general';

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
  targetClientSchedule: ClientScheduleDetail | null;
  historyChiefComplaints: HistoryChiefComplaint[];
  targetClientGroup: ClientGroup[];
  appointmentCalendarInitOption: number[];
  userShifts: UserShift[];
  historyRecords: HistoryRecord[];
  machineSchedules: MachineSchedule[];
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
    targetClientSchedule: null,
    historyChiefComplaints: [],
    targetClientGroup: [],
    appointmentCalendarInitOption: [],
    userShifts: [],
    historyRecords: [],
    machineSchedules: [],
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

      const count = Math.ceil(end.diff(start, 'm') / 30);

      return {
        start: start.get('h') * 2,
        count,
      };
    },
    activeUsers: (state) => {
      const { users } = state;

      return users.filter(({ stateOfWork, role }) => stateOfWork !== WorkState['離職'] && role.type !== RoleType['櫃檯']).map(member => ({
        label: member.name,
        value: member.id,
        ...member,
      }));
    },
    scheduleModifyHistories: (state) => {
      const { targetClientSchedule } = state;
      if (!targetClientSchedule) {
        return [];
      }
      return targetClientSchedule.clientSchedulesModifyHistories.map((item) => {
        return {
          state: ScheduleState[item.afterState],
          name: item.modifyUserName,
          date: item.modifyDateTime,
        };
      });
    },
    resourceLabels: (state) => {
      const { users, userShifts } = state;

      const activeUsers = users.filter(({ stateOfWork, role }) => stateOfWork !== WorkState['離職'] && role.type !== RoleType['櫃檯']).map(member => ({
        label: member.name,
        value: member.id,
        ...member,
      }));

      return activeUsers.reduce((acc, user) => {
        const shiftsOfUser = userShifts.filter(shift => shift.userId === user.id);
        return { ...acc, [user.id]: shiftsOfUser };
      }, {} as Record<string, any>);
    },
    medicalHistoryRecords: ({ historyRecords }) => {
      return historyRecords.map((record) => {
        const { assessmentResults, chiefComplaint, forExerciseGroup, forFrontDesk, treatmentNotes, treatmentPlan, userShiftType, date } = record;
        return {
          userShiftType,
          date,
          record: {
            chiefComplaint: { label: '主訴', value: chiefComplaint },
            assessmentResults: { label: '評估結果', value: assessmentResults },
            treatmentPlan: { label: '治療計劃', value: treatmentPlan },
            treatmentNotes: { label: '治療備註', value: treatmentNotes },
            forExerciseGroup: { label: '給運動組的建議', value: forExerciseGroup },
            forFrontDesk: { label: '給櫃檯的建議', value: forFrontDesk },
          },
        };
      });
    },
    magneticWaveHistoryRecords: ({ historyRecords }) => {
      return historyRecords.map((record) => {
        const { magneticWavesRecords, userShiftType, date } = record;
        return {
          userShiftType,
          date,
          record: { magneticWavesRecords: { label: '磁波治療紀錄', value: magneticWavesRecords } },
        };
      });
    },
    GChariHistoryRecords: ({ historyRecords }) => {
      return historyRecords.map((record) => {
        const { magneticGChairRecords, userShiftType, date } = record;
        return {
          userShiftType,
          date,
          record: { magneticGChairRecords: { label: 'G動椅治療紀錄', value: magneticGChairRecords } },
        };
      });
    },
    isSameSpaceClinicSchedule: (state) => {
      const userStore = useUserStore();
      return state.targetClientSchedule?.userShift.spaceId === userStore.currentSpace?.id;
    },
    needToSignFirstVisit: state => state.targetClientSchedule?.isSignedFirstVisitContract === false,
    needToSignMachineContract: state => state.targetClientSchedule?.isSignedIndependentMachineContract === false || state.targetClientSchedule?.addOnServices.some(service => service.isAddOn && !service.contractTaskId),
    targetAppointmentAddOns: state => state.targetClientSchedule?.addOnServices.filter(service => !!service.isAddOn)?.map(service => service.serviceType) ?? [],
    queryAddOns: state => state.availableQuery?.addOnUserShiftTypes ?? [],
    machineOnlyAppointment: (state) => {
      if (state.machineSchedules.length === 0)
        return [];

      return state.machineSchedules.reduce((list, appointment) => {
        if (MachineShifts.includes(appointment.userShift.type)) {
          list.push(appointment);
        }
        else if (appointment.machines.length > 0) {
          const individualMachines = appointment.machines.map(machine => ({
            ...appointment,
            scheduleStartTime: machine.machineStartTime,
            scheduleEndTime: machine.machineEndTime,
            machine,
          }));
          list.push(...individualMachines);
        }
        return list;
      }, [] as MachineSchedule[]);
    },
  },
  actions: {
    async getUsers(spaceIds: number[]) {
      const data = await fetchUsers({ spaceIds });
      this.users = data;
    },
    async getClients() {
      const { data } = await fetchClients(this.clientQuery);
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
      return data;
    },
    async getClientSchedule(clientScheduleId: number) {
      const data = await fetchClientSchedule(clientScheduleId);
      this.targetClientSchedule = data;
    },
    async uploadAttachments(medicalRecordId: number, attachment: File) {
      const { url, fileName, maxFileSizeInMB } = await getUploadS3Url(medicalRecordId);
      await upload2awsS3(url, attachment, maxFileSizeInMB);
      return fileName;
    },
    async getHistoryChiefComplaints(medicalRecordId: number) {
      const data = await fetchHistoryChiefComplaints(medicalRecordId);
      this.historyChiefComplaints = data;
    },
    async getClientGroup(clientId: number) {
      const data = await fetchClientGroup(clientId);
      this.targetClientGroup = data;
    },
    async getShifts(params: UserShiftsGet) {
      const data = await fetchUserShifts(params);
      this.userShifts = data;
    },
    async getHistoryRecords(recordId: number) {
      const data = await fetchHistoryRecords(recordId);
      this.historyRecords = data;
    },
    async getMachineScheduleInprogress(query: Parameters<typeof getMachineScheduleInprogress>[0]) {
      const data = await getMachineScheduleInprogress(query);
      this.machineSchedules = data;
    },
    async getAddOnHistoryRecords(query: Parameters<typeof fetchAddOnHistoryRecords>[0]) {
      const data = await fetchAddOnHistoryRecords(query);
      this.historyRecords = data;
    },
  },

});
