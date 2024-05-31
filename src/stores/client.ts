import { defineStore } from 'pinia';
import { type Client, getClientInfo, getInbodyUploadUrl, upload2awsS3, uploadInbodyFile } from '@/api';

interface State {
  targetClient: Client | null;
}

export const useClientStore = defineStore('client', {
  state: (): State => {
    return {
      targetClient: null,
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
    uploadInbodyFile,
  },
});
