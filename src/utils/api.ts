import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Notify } from 'quasar';
import type { QNotifyCreateOptions } from 'quasar';
import { getCookie } from './cookies';

// ========== Types ==========
interface APIResponse<T, D = any> {
  data: T;
  meta?: D;
};
type StatusPair = [number, string];

// ========== Interceptors ==========
const instance = axios.create({
  baseURL: '/api',
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
  get<T, D = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<APIResponse<T, D>> {
    return instance.get(url, config);
  },
  post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<APIResponse<T>> {
    return instance.post(url, data, config);
  },
  put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<APIResponse<T>> {
    return instance.put(url, data, config);
  },
  delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<APIResponse<T>> {
    return instance.delete(url, config);
  },
};

// ========== Functions ==========
function requestInterceptor(config: InternalAxiosRequestConfig) {
  const token = getCookie('token');
  const isLogin = config.url === 'login';

  if (!isLogin && token) {
    config.headers!.Authorization = `Bearer ${token}`;
  }
  return config;
}

function requestInterceptorCatch(error: AxiosError) {
  return Promise.reject(error);
}

function responseInterceptor(response: AxiosResponse) {
  return response.data;
}

function responseInterceptorCatch(error: AxiosError) {
  const status = error.response?.status;
  const notifyMessage = getNotifyMessage(status);
  const notifyOptions = getNotifyOptions(notifyMessage, error.message);
  Notify.create(notifyOptions);

  return Promise.reject(error);
}

function getNotifyMessage(status?: number) {
  if (!status) {
    return 'No Internet or Unknown Error';
  }

  const STATUS_PAIRS: StatusPair[] = [
    [401, '401 - Unauthorized'],
    [403, '403 - Forbidden'],
    [404, '404 - Not Found'],
    [422, '422 - Invalid Payload'],
  ];
  const statusMap = new Map(STATUS_PAIRS);

  const message = statusMap.get(status);
  if (!message) {
    return 'No Matched Status';
  }
  return message;
}

function getNotifyOptions(
  message: string,
  caption: string,
) {
  const options: QNotifyCreateOptions = {
    message,
    caption,
    type: 'negative',
    timeout: 5000,
    progress: true,
  };
  return options;
}
