import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Dialog, Notify } from 'quasar';
import type { QNotifyCreateOptions } from 'quasar';
import { getCookie } from '@/utils/helpers';
import { ErrorMessages } from '@/api/errorMessages';

// ========== Types ==========
interface APIResponse<T, D = any> {
  data: T;
  meta?: D;
};
// type StatusPair<T> = [number, T];

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
  'spaces/login',
  'clients',
];

// ========== Functions ==========
function requestInterceptor(config: InternalAxiosRequestConfig) {
  const { url } = config;
  if (!url) {
    return config;
  }

  const needToken = !noTokenList.includes(url);
  if (!needToken) {
    return config;
  }

  const needFirstToken = firstTokenList.includes(url) || url.includes('resend-activation-email');
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
    message: string;
  };
}

async function responseInterceptorCatch(error: AxiosError<ErrorResponse>) {
  const {
    // status,
    data,
  } = error.response!;
  // const notifyMessage = getNotifyMessage(status);
  // const notifyOptions = getNotifyOptions(notifyMessage, error.message);
  // Notify.create(notifyOptions);

  const response = data.data.message;
  const errorMessage = ErrorMessages.get(response) ?? '未知的錯誤';
  await dialogPromise(errorMessage);

  return Promise.reject(error);
}

function dialogPromise(message: string) {
  return new Promise<void>((resolve) => {
    Dialog.create({
      message,
    }).onOk(() => resolve());
  });
}

// function getNotifyMessage(status?: number) {
//   if (!status) {
//     return 'No Internet or Unknown Error';
//   }

//   const STATUS_PAIRS: StatusPair<string>[] = [
//     [401, '401 - Unauthorized'],
//     [403, '403 - Forbidden'],
//     [404, '404 - Not Found'],
//     [422, '422 - Invalid Payload'],
//   ];
//   const statusMap = new Map(STATUS_PAIRS);

//   const message = statusMap.get(status);
//   if (!message) {
//     return 'No Matched Status';
//   }
//   return message;
// }

// function getNotifyOptions(
//   message: string,
//   caption: string,
// ) {
//   const options: QNotifyCreateOptions = {
//     message,
//     caption,
//     type: 'negative',
//     timeout: 5000,
//     progress: true,
//   };
//   return options;
// }

// function getCatchHandler(error: AxiosError) {
//   const { url: endpoint } = error.config!;
//   const { status } = error.response!;
//   const STATUS_PAIRS: StatusPair<() => void>[] = [
//     [401, handler401],
//   ];
//   const handlerMap = new Map(STATUS_PAIRS);

//   return handlerMap.get(status);

//   function handler401() {
//     if (endpoint?.endsWith('login')) {
//       Dialog.create({
//         title: '錯誤',
//         message: '帳號或密碼錯誤',
//       });
//     }
//   }
// }
