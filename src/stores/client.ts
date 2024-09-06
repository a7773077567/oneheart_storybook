import { defineStore } from 'pinia';
import { type Client, type DepInChargeTherapist, getClientInfo, getDepInChargeTherapist, getInbodyUploadUrl, upload2awsS3, uploadInbodyFile } from '@/api';

interface State {
  targetClient: Client | null;
  inChargeUsers: DepInChargeTherapist[];
}

export const useClientStore = defineStore('client', {
  state: (): State => {
    return {
      targetClient: null,
      inChargeUsers: [],
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
  },
});
