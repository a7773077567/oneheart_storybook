import { api } from '@/utils/api';
import { z } from 'zod';
import type { Client, UserShift } from '@/api';
import { getTimeDate } from '@/utils/date';

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
  dynamicPressureAttachments: string[];
  staticPressureAttachments: string[];
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
  staticPressureAttachments: string[]; // 靜態足壓檔案
  dynamicPressureAttachments: string[]; // 動態足壓檔案
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
  id: number;
  clientId: number;
  client: Client;
  date: string;
  userShiftId: number;
  userShift: UserShift;
  userShiftSlotId: number;
  userShiftAppointmentId: number;
  scheduleStartTime: string;
  scheduleEndTime: string;
  bookedNumber: number;
  paymentState: number;
  state: number;
  isBeenRearranged: boolean;
  isEmployeePrice: boolean;
  isFirstClientSchedule: boolean;
  isRearrangedClientSchedule: boolean;
  isValidForRestore: boolean;
  rearrangeClientSchedule: ClientSchedule | null;
  note: string;
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
  type: number;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  user: {
    id: number;
    name: string;
  };
  appointmentStatus: AppointmentStatus | null;
}

export interface CreateAppointment {
  isEmployeePrice: boolean;
  slotId: number | null;
  userShiftId: number;
  bookingClientIds: number[];
  note?: string | null;
}

export interface AppointmentRearrangeReq {
  clientScheduleId: number;
  slotId: number;
  userShiftId: number;
}

export interface ClientScheduleDetail extends ClientSchedule {
  medicalAndTrainingRecordId: number;
  record: Record & { userShiftType: number };
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
  serviceName: string;
  isAddOn: boolean;
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
export async function createAppointment(payload: CreateAppointment) {
  const { data } = await api.post<any, CreateAppointment>('appointments/appointment', payload);
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

export async function createAppointmentRearrange(payload: AppointmentRearrangeReq) {
  const { data } = await api.post<any, AppointmentRearrangeReq>('appointments/appointment-rearrange', payload);
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
 * 更新排程加購服務
 * @param clientScheduleId
 */
export async function updateAddOnServices(clientScheduleId: number, addOnServices: AddOnService[]) {
  await api.patch(`/clientSchedules/${clientScheduleId}/update-addOnServices`, { addOnServices });
}

// ========== Schemas ==========
export const availableReqSchema = z.object({
  userShiftType: z.number({ required_error: '必填' }),
  userIds: z.number().array().min(1, { message: '至少選擇1名治療師' }),
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
  userShiftTypes: z.number().array(),
  date: z.string(),
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
