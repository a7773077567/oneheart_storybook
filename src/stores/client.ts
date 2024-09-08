import { defineStore } from 'pinia';
import { type Client, type DepInChargeTherapist, type MedicalHistory, type MedicalHistoryParams, getClientInfo, getDepInChargeTherapist, getInbodyUploadUrl, getMedicalHistory, upload2awsS3, uploadInbodyFile } from '@/api';

interface State {
  targetClient: Client | null;
  inChargeUsers: DepInChargeTherapist[];
  medicalHistory: MedicalHistory[];
}

export const useClientStore = defineStore('client', {
  state: (): State => {
    return {
      targetClient: null,
      inChargeUsers: [],
      medicalHistory: [],
    };
  },
  getters: {
  },
  actions: {
    async getClientInfo(clientId: number) {
      this.targetClient = await getClientInfo(clientId);
    },
    async uploadInbody2S3(clientId: number, attachment: File) {
      const { url, fileName, maxFileSizeInMB } = await getInbodyUploadUrl(clientId);
      await upload2awsS3(url, attachment, maxFileSizeInMB);
      return fileName;
    },
    async getDepInChargeTherapist(clientId: number) {
      this.inChargeUsers = await getDepInChargeTherapist(clientId);
    },
    uploadInbodyFile,
    async  getMedicalHistory(clientId: number, params: MedicalHistoryParams) {
      this.medicalHistory = await getMedicalHistory(clientId, params);
    },
  },
});
