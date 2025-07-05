import { api } from '@/utils/api';
import type { E } from 'node_modules/msw/lib/core/GraphQLHandler-eJejgV5u';

export interface CounterSalaryDetail {
  id: number;
  totalAmount: number;
  baseSalary: number;
  profitShareAmount: ProfitShareAmount;
  extraBonusAmount: number;
  counterQuarterlyBonus: CounterQuarterlyBonus[];
  isConfirmed: boolean;
}

interface CounterQuarterlyBonus {
  space: Space;
  therapistCount: number;
  quarterlyExecutionCount: number;
  quarterlyRevenueAmount: number;
  finalPercentage: number;
  quarterlyBonusAmount: number;
  totalCounterShares: number;
  fullTimeCounterUserCount: number;
  partTimeCounterUserCount: number;
  userShare: number;
  commissionAmount: number;
  averagePrice: number;
  executionCountStandardPerPerson: number[];
  quarterlyExecutionStandard: number[];
  quarterlySalesStandard: number[];
  commissionRatios: number[];
}

interface ProfitShareAmount {
  amount: number;
  totalRechargeAmount: number;
  profitSharePercentage: number;
}

export interface ExecutionClientSchedule {
  id: number;
  client: Client;
  clientId: number;
  date: Date;
  userShiftId: number;
  userShift: UserShift;
  userShiftAppointmentId: number;
  scheduleStartTime: string;
  scheduleEndTime: string;
  bookedNumber: number;
  coachClassClients: Client[];
  note: string;
  machines: Machine[];
  paymentState: boolean;
  state: number;
  isEmployeePrice: boolean;
  isValidForRestore: boolean;
  isBeenRearranged: boolean;
  isRearrangedClientSchedule: boolean;
  rearrangeClientSchedule: null;
  isFirstClientSchedule: boolean;
  addOnServices: AddOnServices[];
  isUsingAutoRecommend: boolean;
  isUserShiftDeleted: boolean;
  isHighSalesOpportunity: boolean;
  referalUser: ReferalUser;
  firstScheduleState: number;
  executionCount: number;
}

export interface AddOnServices {
  isAddOn: boolean;
  contract: string;
  contractDownloadTime: null;
  contractTaskId: null;
  contractStatus: string;
  startTime: string;
  endTime: string;
  machine: string;
  machineId: null;
  type: number;
  serviceName: string;
  serviceType: number;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  lineUserId: string;
  isVerifiedBySMS: boolean;
  isBlacklisted: boolean;
  identityType: number;
  identityNumber: string;
  birthDate: Date;
  associations: Association[];
  inBodyFiles: InBodyFile[];
  inBodyFileUrls: string[];
  gender: string;
  address: string;
  note: string;
  relationTypeName: string;
  howToKnowUs: string;
  introducer: string;
  liffIntroducerName: string;
  firstVisitContractUrl: string;
  clientMachineContractsStatus: ClientMachineContractsStatus[];
}

export interface Association {
  id: number;
  name: string;
  phone: string;
  identityType: number;
  identityNumber: string;
  birthDate: Date;
}

export interface ClientMachineContractsStatus {
  hasSignedNewContract: boolean;
  newContractType: number;
}

export interface InBodyFile {
  fileName: string;
  createdAt: Date;
}

export interface Machine {
  id: number;
  name: string;
  type: number;
  machineStartTime: string;
  machineEndTime: string;
}

export interface ReferalUser {
  id: number;
  name: string;
  email: string;
  jobClass: number;
  PTLevel: number;
  baseSalary: number;
  state: string;
  stateOfWork: string;
  hireDate: Date;
  avatar: string;
  avatarUrl: string;
  weightForOrder: number;
  description: string;
  role: Role;
  spaces: Space[];
  ancestor: string;
  introducer: string;
  isPartTime: boolean;
}

export interface Role {
  id: number;
  name: string;
  type: number;
}

export interface Space {
  id: number;
  name: string;
}

export interface UserShift {
  id: number;
  spaceId: number;
  userId: number;
  user: User;
  type: number;
  name: string;
  maxClients: number;
  space: Role;
}

export interface User {
  id: number;
  name: string;
  role: Role;
}

export interface PaginationMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface DetailParams {
  order?: 'ASC' | 'DESC';
  page?: number;
  take?: number;
  yearMonth: string;
  userId: number;
  spaceId: number;
}

export interface RevenuePayment {
  id: number;
  clientId: number;
  clientName: string;
  date: Date;
  spaceName: string;
  type: number;
  amount: number;
  pointPaymentPlan: string;
  pointPaymentClientGroupName: string;
  pointPaymentClientGroupType: number;
  paidPointGained: number;
  giftPointGained: number;
  groupClassName: string;
  ticketGained: number;
  pointUsed: number;
  pointPaymentMultiChannelPay: TPaymentMultiChannelPay[];
  clientSchedulePaymentMultiChannelPay: ClientSchedulePaymentMultiChannelPay[];
  groupClassTicketPaymentMultiChannelPay: TPaymentMultiChannelPay[];
  addOnServices: AddOnServices;
  isDeleted: boolean;
  sellers: Charger[];
  chargers: Charger[];
}

export interface AddOnServices {
  isAddOn: boolean;
  contract: string;
  contractDownloadTime: null;
  contractTaskId: null;
  contractStatus: string;
  startTime: string;
  endTime: string;
  machine: string;
  machineId: null;
  type: number;
  serviceName: string;
  serviceType: number;
}

export interface Charger {
  id: number;
  name: string;
  email: string;
  jobClass: number;
  PTLevel: number;
  baseSalary: number;
  state: string;
  stateOfWork: string;
  hireDate: Date;
  avatar: string;
  avatarUrl: string;
  weightForOrder: number;
  description: string;
  role: Role;
  spaces: Space[];
  ancestor: string;
  introducer: string;
  isPartTime: boolean;
}

export interface Role {
  id: number;
  name: string;
  type: number;
}

export interface Space {
  id: number;
  name: string;
}

export interface ClientSchedulePaymentMultiChannelPay {
  payMethod: number;
  clientGroupName: string;
  pointUsed: number;
  amount: number;
  authorisationCode: string;
  receiptNumber: string;
  groupClassTicketUsed: number;
  details: string;
}

export interface TPaymentMultiChannelPay {
  payMethod: number;
  amount: number;
  authorisationCode: string;
  receiptNumber: string;
  details: string;
}

export async function fetchCounterSalaryDetail(userId: number, yearMonth: string) {
  const { data } = await api.get<CounterSalaryDetail>(`salaries/counter-salary-detail`, { params: { userId, yearMonth } });
  return data;
}

export async function confirmCounterSalary(payload: { yearMonth: string }) {
  const { data } = await api.post(`salaries/confirm-counter-salary`, payload);
  return data;
}

export async function fetchExecutionClientScheduleList(params: DetailParams) {
  const { data, meta } = await api.get<ExecutionClientSchedule[], PaginationMeta>(`salaries/counter-quarterly-execution-count-clientSchedule-list`, { params });
  return { data, meta: meta! };
}

export async function fetchRevenuePaymentList(params: DetailParams) {
  const { data, meta } = await api.get<RevenuePayment[], PaginationMeta>(`salaries/counter-quarterly-revenue-payment-list`, { params });
  return { data, meta: meta! };
}
