import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Dialog } from 'quasar';
import { getCookie } from '@/utils/helpers';
import { ErrorMessages } from '@/api/errorMessages';

// ========== Types ==========
interface APIResponse<T, D = any> {
  data: T;
  meta?: D;
};

// ========== Interceptors ==========
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
instance.interceptors.request.use(
  requestInterceptor,
  requestInterceptorCatch,
);
instance.interceptors.response.use(
  responseInterceptor,
  responseInterceptorCatch,
);

// ========== Request Methods ==========
export const api = {
  get<DataRes, MetaRes = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<APIResponse<DataRes, MetaRes>> {
    return instance.get(url, config);
  },
  post<DataRes, DataPayload = any>(
    url: string,
    data?: DataPayload,
    config?: AxiosRequestConfig,
  ): Promise<APIResponse<DataRes>> {
    return instance.post(url, data, config);
  },
  put<DataRes, DataPayload = any>(
    url: string,
    data?: DataPayload,
    config?: AxiosRequestConfig,
  ): Promise<APIResponse<DataRes>> {
    return instance.put(url, data, config);
  },
  patch<DataRes, DataPayload = any>(
    url: string,
    data?: DataPayload,
    config?: AxiosRequestConfig,
  ): Promise<APIResponse<DataRes>> {
    return instance.patch(url, data, config);
  },
  delete<DataRes>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<APIResponse<DataRes>> {
    return instance.delete(url, config);
  },
};

const noTokenList = [
  'users/login',
  'users/user-login',
  'users/forgot-password',
];

const firstTokenList = [
  'users',
  'users/activate',
  'users/activate/email',
  'users/reset-password',
  'users/me',
  'avatar/write-url',
  'spaces',
  'spaces/login',
  'clients',
  'resend-activation-email',
  'clientGroups',
  'payments',
  'groupClassTickets',
];

function checkClientFirstToken(url: string, method: string) {
  const clientExclusionList = [
    'memos',
    'addInbodyFiles',
  ];
  const inExclusion = clientExclusionList.some(item => url.includes(item));
  const isMemos = url.includes('memos');

  if (isMemos) {
    if (method !== 'get') {
      return false;
    }
  }
  else if (inExclusion) {
    return false;
  }
  return true;
}

// ========== Functions ==========
function requestInterceptor(config: InternalAxiosRequestConfig) {
  const { url, method } = config;

  if (!url) {
    return config;
  }

  const needToken = !noTokenList.includes(url);
  if (!needToken) {
    return config;
  }

  const needFirstToken = firstTokenList.some(item => url.includes(item)) && checkClientFirstToken(url, method!);
  const token = needFirstToken ? getCookie('firstToken') : getCookie('secondToken');
  config.headers!.Authorization = `Bearer ${token}`;

  return config;
}

function requestInterceptorCatch(error: AxiosError) {
  return Promise.reject(error);
}

function responseInterceptor(response: AxiosResponse) {
  return response.data;
}

interface ErrorResponse {
  data: {
    message: string | string[];
  };
}

async function responseInterceptorCatch(error: AxiosError<ErrorResponse>) {
  const {
    status,
    data,
    config,
  } = error.response!;

  const url = config.url;
  if (url === 'users/me' && status === 401) {
    return Promise.reject(error);
  }

  const resMsg = data.data.message;
  let errMsg;
  if (Array.isArray(resMsg)) {
    errMsg = getMultipleErrorMessages(resMsg);
  }
  else {
    errMsg = ErrorMessages.get(resMsg) ?? '未知的錯誤';
  }
  await dialogPromise(errMsg);

  return Promise.reject(error);
}

function dialogPromise(message: string) {
  return new Promise<void>((resolve) => {
    Dialog.create({
      message,
      html: true,
    }).onOk(() => resolve());
  });
}

function getMultipleErrorMessages(msgArr: string[]) {
  return msgArr.map((item) => {
    const msg = ErrorMessages.get(item);
    return msg ? `<p>${msg}</p>` : '<p>未知的錯誤</p>';
  }).join('');
}
