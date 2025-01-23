import { api } from '@/utils/api';
import { z } from 'zod';
import type { Client, MachineInfo, Space, User, UserShiftDetail } from '@/api';
import { getTimeDate } from '@/utils/date';
import type { ScheduleVisitState } from '@/const/appointment';
import type { MachineSchedule } from './machine';
import type { AddOnServiceTypes, MachineTypes } from '@/const/general';
import { ShiftType } from '@/const/general';

export interface TherapyTypesRes {
  therapyTypes: string[];
}

export interface Therapist {
  id: number;
  type: number;
  name: string;
  avatar: string;
}
export interface TherapistsRes {
  therapists: Therapist[];
}

export interface Location {
  id: number;
  type: number;
  name: string;
  accommodation: number;
}

// todo 區分不同病例種類
export interface Record {
  chiefComplaint: string;
  pastHistory: string;
  occupationType: string;
  exerciseHabits: string;
  others: string;
  clinicalObservation: string;
  palpation: string;
  movementAssessment: string;
  problemSummary: null;
  treatmentNotes: string;
  forExerciseGroup: string;
  assessmentResults: string;
  treatmentPlan: string;
  forFrontDesk: string;
  attachments: string[];
  note: string;
  dynamicPressureAttachments: Attachment[];
  staticPressureAttachments: Attachment[];
  personalHealthStatus: string;
  nutritionistAdvice: string;
  customerProblemDescription: string;
  assessmentStatus: string;
  productDescription: string;
  coachAdvice: string;
  canvasAttachment: string;
  forMedicalGroup: string;
  forClient: string;
  trainingRecords: [
    {
      exercise: string;
      weight: string;
      reps: string;
      intensity_Sets: string;
      notes: string;
    },
  ];
  advice: string;
  magneticWavesRecords: MagneticWavesRecord[];
  magneticGChairRecords: GChairRecord[];
  independentShockWaveShots: number | null; // 獨立預約震波發數
  addOnServiceShockWaveShots: number | null; // 加購震波發數
}

export interface MagneticWavesRecord {
  sequence: string; // 程序
  bodyPart: string; // 部位
  intensity: string; // 強度
};
export interface GChairRecord {
  sequence: string; // 程序
  intensity: string; // 強度
};
export interface Attachment {
  originalFileName: string; // 原始檔案名稱
  fileName: string; // UUID
  attachmentUrl?: string;
}

export interface Nutrition {
  personalHealthStatus: string; // 個人健康狀況
  nutritionistAdvice: string; // 營養師建議
  attachments: string[];
}

export interface Sleep {
  customerProblemDescription: string; // 客戶問題描述
  assessmentStatus: string; // 評估狀況
  productDescription: string; // 產品描述
  note: string; // 備註
  attachments: string[];
}

export interface MedicalRecord {
  chiefComplaint: string; // 主訴
  assessmentResults: string; // 評估結果
  treatmentPlan: string; // 治療計畫
  treatmentNotes: string; // 治療備註
  forExerciseGroup: string; // 給運動組的建議
  forFrontDesk: string; // 給櫃檯的建議
  attachments: string[];
}

// ========== HistoryRecords for all types  ==========
export type HistoryRecord = MedicalHistoryRecord & OtherHistoryRecord;

export interface OtherHistoryRecord {
  userShiftType: 1 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
  record: {
    pastHistory: string | null;
    occupationType: any;
    exerciseHabits: string | null;
    others: string | null;
    clinicalObservation: string | null;
    palpation: string | null;
    movementAssessment: string | null;
    problemSummary: string | null;
    canvasAttachment: null;
    attachments: any[];
    note: string | null;
    dynamicPressureAttachments: null;
    staticPressureAttachments: null;
    personalHealthStatus: string | null;
    nutritionistAdvice: string | null;
    customerProblemDescription: string | null;
    assessmentStatus: string | null;
    productDescription: string | null;
    coachAdvice: string | null;
    trainingRecords: string | null;
    forMedicalGroup: string | null;
    forClient: string | null;
  };

}

export interface MedicalHistoryRecord {
  userShiftType: 2;
  record: {
    assessmentResults: string | null;
    chiefComplaint: string | null;
    forExerciseGroup: string | null;
    forFrontDesk: string | null;
    treatmentNotes: string | null;
    treatmentPlan: string | null;
  };
}

// ========== HistoryRecords for all types  ==========

export interface PhysicalConsultation {
  chiefComplaint: string; // 主訴
  pastHistory: string; // 病史
  occupationType: string; // 職業類型/生活型態
  exerciseHabits: string; // 運動習慣
  others: string; // 其他
  clinicalObservation: string; // 臨床觀察
  palpation: string; // 觸診
  movementAssessment: string; // 動作測試
  problemSummary: string; // 問題總結
  treatmentNotes: string; // 治療備註
  forExerciseGroup: string; // 給運動組的建議
}

export interface FootPressure {
  staticPressureAttachments: Attachment[]; // 靜態足壓檔案
  dynamicPressureAttachments: Attachment[]; // 動態足壓檔案
  notes: string; // 備註
}

export interface TrainingPlan {
  forMedicalGroup: string; // 給治療組的建議
  forFrontDesk: string; // 給櫃檯的建議
  forClient: string; // 給客戶的建議
  trainingRecords: [
    {
      exercise: string;
      weight: string;
      reps: string;
      intensity_Sets: string;
      notes: string;
    },
  ];
}

export interface SportConsultation {
  chiefComplaint: string; // 主訴
  coachAdvice: string; // 教練建議
}

export interface ClientSchedule {
  addOnServices: AddOnService[];
  bookedNumber: number;
  client: Client;
  clientId: number;
  clientSchedulesModifyHistories: ClientSchedulesModifyHistory[];
  date: string;
  id: number;
  isBeenRearranged: boolean;
  isEmployeePrice: boolean;
  isFirstClientSchedule: boolean;
  isHighSalesOpportunity: boolean;
  isRearrangedClientSchedule: boolean;
  isSignedFirstVisitContract: boolean | null;
  isSignedIndependentMachineContract?: boolean; // 判斷獨立儀器是否已經簽約
  isUsingAutoRecommend: boolean;
  isValidForRestore: boolean;
  note: string;
  paymentState: number;
  rearrangeClientSchedule: ClientSchedule | null;
  scheduleEndTime: string;
  scheduleStartTime: string;
  state: number;
  userShift: UserShiftDetail;
  userShiftAppointmentId: number;
  userShiftId: number;
  userShiftSlotId: number;
}

export interface ClientSchedulesModifyHistory {
  modifyUserName: string;
  modifyClientName: string;
  modifyDateTime: string;
  sequenceNumber: number;
  beforeState: number;
  afterState: number;
}

export interface BookingItem {
  id: number;
  type: number;
  date: string;
  time: string;
  isBooked: boolean;
  available: boolean;
  location: number;
  state: number;
  isCheckout: boolean;
  employee: any;
  client: Client;
  therapist: Therapist;
  left?: number;
  width?: number;
}

export interface AppointmentStatus {
  maxNumber: number;
  bookedNumber: number;
  leftNumber: number;
  currentProximateNumber: number;
}

export interface Available {
  slotId: number;
  userShiftId: number;
  type: ShiftType;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  user: {
    id: number;
    name: string;
  };
  appointmentStatus: AppointmentStatus | null;
  machine: null | MachineInfo;
  space: Space;
}

export interface CreateAppointmentPayload {
  bookingClientIds: number[];
  date: string | null;
  endTime: string;
  isEmployeePrice: boolean;
  machineId: number | null; // G動椅才需要，其他科別帶 null
  note?: string | null;
  spaceId: number;
  startTime: string;
  userShiftType: ShiftType;
  userShiftId: number;
}

export interface CreateAppointmentRearrangePayload {
  clientScheduleId: number;
  userShiftId: number;
  startTime: string;
  endTime: string;
}

export interface ClientScheduleDetail extends ClientSchedule {
  medicalAndTrainingRecordId: number;
  record: Record & { userShiftType: number };
  machines?: MachineSchedule['machines'];
};

interface UploadInfo {
  fileName: string;
  maxFileSizeInMB: number;
  method: 'PUT';
  url: string;
}

export interface HistoryChiefComplaint {
  date: string;
  chiefComplaint: string;
}

export interface ClientInGroup {
  id: number;
  name: string;
  phone: string;
}

export interface ClientGroup {
  id: number;
  type: number;
  name: string;
  adminClient: ClientGroup;
  memberClients: ClientInGroup[];
  points: number;
}

export interface Checkout {
  amount: number;
  multiChannelPay: {
    payMethod: number;
    amount: number | null;
    authorisationCode: string | null;
    receiptNumber: string | null;
    clientGroupId: number | null;
    pointUsed: number | null;
    groupClassTicketUsed: number | null;
    details: string;
  }[];
}

export interface AddOnService {
  contractStatus: string;
  contractTaskId: number | null;
  endTime: string;
  isAddOn: boolean;
  machine: string;
  machineId: number | null;
  serviceName: string;
  serviceType: AddOnServiceTypes;
  startTime: string;
  type: MachineTypes;
}

export interface AdjustScheduleTimePayload {
  startTime: string;
  endTime: string;
}

// ========== Requests ==========

export async function fetchTherapyTypes() {
  const { data } = await api.get<TherapyTypesRes>('appointment/therapy-types');
  return data;
}

export async function fetchTherapists(type: number) {
  const { data } = await api.get<TherapistsRes>(`appointment/therapists/${type}`);
  return data;
}

/**
 * 預約時段
 * @param payload CreateAppointment
 */
export async function createAppointment(payload: CreateAppointmentPayload) {
  const { data } = await api.post<any, CreateAppointmentPayload>('appointments/appointment', payload);
  return data;
}

/**
 * 取得可預約時段
 * @param params
 */
export async function fetchAvailable(params: AvailableReq) {
  const { data } = await api.get<Available[]>('appointments/available', { params });
  return data;
}

/**
 * 取得可預約改期的可預約時段
 * @param params
 */
export async function fetchAvailableRearranged(params: AvailableRearrangedReq) {
  const { data } = await api.get<Available[]>('appointments/available-rearranged', { params });
  return data;
}

export async function createAppointmentRearrange(payload: CreateAppointmentRearrangePayload) {
  const { data } = await api.post<any, CreateAppointmentRearrangePayload>('appointments/appointment-rearrange', payload);
  return data;
}

export async function fetchClientSchedulesNotStarted(params: ClientSchedulesNotStartedReq) {
  const { data } = await api.get<ClientSchedule[]>('clientSchedules/not-started', { params });
  return data;
}

export async function fetchClientSchedulesHistories(params: ClientSchedulesHistoriesReq) {
  const { data } = await api.get<ClientSchedule[]>('clientSchedules/histories', { params });
  return data;
}

/**
 * 取消客戶未開始排程
 * @param clientScheduleId
 */
export async function cancelClientScheduleNotStarted(clientScheduleId: number) {
  const { data } = await api.post(`clientSchedules/${clientScheduleId}/cancel`);
  return data;
}

/**
 * 取得客戶進行中排程
 * @param date
 */
export async function fetchClientSchedulesInProgress(date: string) {
  const { data } = await api.get<ClientSchedule[]>('clientSchedules/in-progress', { params: { date } });
  return data;
}

export async function restoreClientSchedule(clientScheduleId: number) {
  const { data } = await api.post(`clientSchedules/${clientScheduleId}/restore`);
  return data;
}

/**
 * 取得單一排程
 * @param clientScheduleId
 */
export async function fetchClientSchedule(clientScheduleId: number) {
  const { data } = await api.get<ClientScheduleDetail>(`clientSchedules/${clientScheduleId}`);
  return data;
}
export async function updateClientSchedule(medicalRecordId: number, updateContent: Partial<Record>) {
  const { data } = await api.patch(`medicalAndTrainingRecords/${medicalRecordId}`, updateContent);
  return data;
}
export async function getUploadS3Url(medicalRecordId: number) {
  const { data } = await api.get<UploadInfo>(`medicalAndTrainingRecords/${medicalRecordId}/attachments/write-url`);
  return data;
}

export async function fetchHistoryChiefComplaints(medicalRecordId: number) {
  const { data } = await api.get<HistoryChiefComplaint[]>(`medicalAndTrainingRecords/${medicalRecordId}/historyChiefComplaint`);
  return data;
}

export async function appointmentCheckIn(clientScheduleId: number) {
  const { data } = await api.post(`clientSchedules/${clientScheduleId}/check-in`);
  return data;
}

export async function appointmentFinishService(clientScheduleId: number) {
  const { data } = await api.post(`clientSchedules/${clientScheduleId}/finish-service`);
  return data;
}

export async function appointmentFinishRecord(clientScheduleId: number) {
  const { data } = await api.post(`clientSchedules/${clientScheduleId}/finish-record`);
  return data;
}

export async function fetchClientGroup(clientId: number) {
  const { data } = await api.get<ClientGroup[]>(`clients/${clientId}/clientGroups`);
  return data;
}

export async function checkout(scheduleId: number, payload: Checkout) {
  const { data } = await api.post<any, Checkout>(`clientSchedules/${scheduleId}/checkout`, payload);
  return data;
}

/**
 * 更新欄位備註
 */
export async function updateNote(clientScheduleId: number, note: string) {
  await api.patch(`clientSchedules/${clientScheduleId}/update-note`, { note });
}

/**
 * 新增排程加購
 * @param {object} params - The parameters for adding the service.
 * @param {number} params.clientScheduleId - The ID of the client's schedule.
 * @param {AddOnServiceTypes} params.serviceType - The type of additional service to add.
 */
export async function addOnService({ clientScheduleId, serviceType }: { clientScheduleId: number; serviceType: AddOnServiceTypes }) {
  await api.post(`/clientSchedules/${clientScheduleId}/addOnService`, { serviceType });
}

export interface UpdateAddOnMachinePayload {
  serviceType: AddOnServiceTypes;
  machineId:	number;
  startTime: string;
  endTime: string;
  addOnServiceShockWaveShots?:	number;
}
/**
 * 更新排程加購服務
 * @param {object} params - The parameters for the update.
 * @param {number} params.clientScheduleId - 排程 id
 * @param {AddOnService[]} params.addOnServices - The list of add-on services to update.
 */
export async function updateAddOnServices({ clientScheduleId, addOnService }: { clientScheduleId: number; addOnService: UpdateAddOnMachinePayload }) {
  await api.patch(`/clientSchedules/${clientScheduleId}/addOnService`, { ...addOnService });
}

/**
 * 移除排程加購
 * @param {object} params - The parameters for the update.
 * @param {number} params.clientScheduleId - 排程 id
 * @param {AddOnServiceTypes} params.serviceType - 加購服務
 */
export async function deleteAddOnService({ clientScheduleId, serviceType }: { clientScheduleId: number; serviceType: AddOnServiceTypes }) {
  await api.delete(`clientSchedules/${clientScheduleId}/addOnService/${serviceType}`);
}

/**
 * 調整排程時間
 *
 * @param clientScheduleId - The ID of the client schedule to adjust.
 * @param payload - The payload containing the new schedule time details.
 * @returns The updated schedule data.
 */
export async function adjustScheduleTime(clientScheduleId: number, payload: AdjustScheduleTimePayload) {
  const { data } = await api.patch(`/clientSchedules/${clientScheduleId}/adjust-scheduleTime`, payload);
  return data;
}

/**
 * 取得相同科別歷史紀錄
 */
export async function fetchHistoryRecords(recordId: number) {
  const { data } = await api.get<HistoryRecord[]>(`/medicalAndTrainingRecords/${recordId}/sameUserShiftTypeHistoryRecords`);
  return data;
}

/**
 * 更改病歷單初診狀態
 */
export async function adjustFirstScheduleState({ clientScheduleId, firstScheduleState }: { clientScheduleId: number; firstScheduleState: ScheduleVisitState }) {
  const { data } = await api.patch(`/clientSchedules/${clientScheduleId}/adjust-firstScheduleState`, { firstScheduleState });
  return data;
}

/**
 * 更改病歷單初診狀態
 */
export async function adjustEmployeePriceState({ clientScheduleId, isEmployeePrice }: { clientScheduleId: number; isEmployeePrice: boolean }) {
  const { data } = await api.patch(`/clientSchedules/${clientScheduleId}/adjust-isEmployeePrice`, { isEmployeePrice });
  return data;
}

/**
 * 取得排程無綁定人員儀器作人員
 * 當天有排班的User，且人員的角色為 type=2~5(院長、副院長、物理治療師組長、物理治療師）。加上角色為 type=10(櫃檯)
 */
export async function getMachineOperatingUsers(clientScheduleId: number) {
  const { data } = await api.get<User[]>(`/clientSchedules/${clientScheduleId}/get-machineOperatingUsers`);
  return data;
}

/**
 * 綁定排程治療師
 * 當天有排班的User，且人員的角色為 type=2~5(院長、副院長、物理治療師組長、物理治療師）。加上角色為 type=10(櫃檯)
 */
export async function updateMachineOperatingUsers(clientScheduleId: number, userId: number) {
  const { data } = await api.patch(`/clientSchedules/${clientScheduleId}/update-machine-operator`, { userId });
  return data;
}

// ========== Schemas ==========
export const availableReqSchema = z.object({
  userShiftType: z.nativeEnum(ShiftType, { required_error: '必填' }),
  userIds: z.number().array().optional(),
  // .min(1, { message: '至少選擇1名治療師' }),
  date: z.string(),
  startTime: z.string().refine(val => val.length === 5, { message: '請輸入HH:mm格式' }),
  endTime: z.string().refine(val => val.length === 5, { message: '請輸入HH:mm格式' }),
})
  .refine(({ startTime, endTime }) => {
    const start = getTimeDate(startTime);
    const end = getTimeDate(endTime);
    return end.isAfter(start);
  }, {
    message: '結束時間必須大於開始時間',
    path: ['endTime'],
  });
export type AvailableReq = z.infer<typeof availableReqSchema>;

export const availableRearrangedSchema = z.object({
  clientScheduleId: z.number(),
  date: z.string(),
  startTime: z.string().refine(val => val.length === 5, { message: '請輸入HH:mm格式' }),
  endTime: z.string().refine(val => val.length === 5, { message: '請輸入HH:mm格式' }),
}).refine(({ startTime, endTime }) => {
  const start = getTimeDate(startTime);
  const end = getTimeDate(endTime);
  return end.isAfter(start);
}, {
  message: '結束時間必須大於開始時間',
  path: ['endTime'],
});
export type AvailableRearrangedReq = z.infer<typeof availableRearrangedSchema>;

export const ClientSchedulesNotStartedSchema = z.object({
  phone: z.string().optional(),
  name: z.string().optional(),
  userShiftTypes: z.number().array().min(1, '需至少選擇一個項目'),
  startDate: z.string(),
  endDate: z.string(),
});
export type ClientSchedulesNotStartedReq = z.infer<typeof ClientSchedulesNotStartedSchema>;

export const clientSchedulesHistoriesSchema = z.object({
  phone: z.string().optional(),
  name: z.string().optional(),
  userShiftTypes: z.number().array(),
  startDate: z.string(),
  endDate: z.string(),
});
export type ClientSchedulesHistoriesReq = z.infer<typeof clientSchedulesHistoriesSchema>;
