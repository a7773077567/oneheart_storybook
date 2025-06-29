import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Dialog, Loading } from 'quasar';
import { getCookie, updateCookie } from '@/utils/helpers';
import { ErrorMessages } from '@/api/errorMessages';
import { ResponseErrorDialog } from '@/components/shared';
import { useAppointmentStore } from '@/stores';
import createAuthRefreshInterceptor, { type AxiosAuthRefreshOptions } from 'axios-auth-refresh';
import { useRouter } from 'vue-router';

// ========== Types ==========
interface APIResponse<T, D = any> {
  data: T;
  meta?: D;
};

// ========== Interceptors ==========
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
});

instance.interceptors.request.use(
  requestInterceptor,
  requestInterceptorCatch,
);
instance.interceptors.response.use(
  responseInterceptor,
  responseInterceptorCatch,
);

// ========== Token refresh ==========
// 需要另外創建 instance 避免 401 重複 loop
const authInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
});

async function refreshAuthLogic(): Promise<any> {
  try {
    const _refreshToken = getCookie('refreshToken');
    if (!_refreshToken) {
      return Promise.reject(new Error('no refresh id'));
    }

    const { data: { data: { accessToken: firstToken, refreshToken } } } = await authInstance.post('users/login-with-refresh-token', { refreshToken: _refreshToken });
    updateCookie('firstToken', firstToken);
    updateCookie('refreshToken', refreshToken);

    const newSpaceId = getCookie('lastSpaceId');
    if (!newSpaceId) {
      return Promise.reject(new Error('no space id'));
    }

    const payload = { spaceId: +newSpaceId };
    const _first = getCookie('firstToken');
    const { data: { data: { accessToken: secondToken } } } = await authInstance.post('spaces/login', payload, {
      headers: {
        Authorization: `Bearer ${_first}`,
      },
    });
    updateCookie('secondToken', secondToken);
    return Promise.resolve();
  }
  catch (error) {
    console.log('🚀 ~ refreshAuthLogic ~ error:', error);
    const router = useRouter();
    router.push({ name: 'userLogin' });
  }
}

const refreshConfig: AxiosAuthRefreshOptions = {
  statusCodes: [401],
};
createAuthRefreshInterceptor(instance, refreshAuthLogic, refreshConfig);

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
  'dottedSign',
  'salaries/therapist-salary-detail',
  'salaries/coach-salary-detail',
  'salaries/counter-salary-detail',
  'coachQuarterlyBonus',
  'salaries/password-recheck',
  'salaries/confirm-counter-salary',
  'salaries/confirm-coach-salary',
  'salaries/confirm-therapist-salary',
  'salaries/revoke-salary-confirmation',
];

function checkClientFirstToken(url: string, method: string) {
  const clientExclusionList = [
    'memos',
    'addInbodyFiles',
    'gainPoint',
    'refundPoint',
    'update-firstVisitContract',
    'refundSpecificPointPayment',
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
  if (!token) {
    return Promise.reject(new Error('No token available'));
  }
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
  if (!error.response || error.response.status === 401) {
    return Promise.reject(error);
  }
  const {
    data,
  } = error.response!;

  const resMsg = data?.data?.message ?? [];
  let errMsg;
  if (Array.isArray(resMsg)) {
    errMsg = getMultipleErrorMessages(resMsg);
  }
  else {
    errMsg = ErrorMessages.get(resMsg) ?? resMsg;
    if (errMsg === '此預約單並非此場館，無法進行此操作') {
      const appointmentStore = useAppointmentStore();
      const spaceName = appointmentStore.targetClientSchedule?.userShift.space.name;
      errMsg = `此功能僅能在${spaceName}操作`;
    }
  }
  Loading.hide();
  await dialogPromise(errMsg);

  return Promise.reject(error);
}

function dialogPromise(message: string) {
  return new Promise<void>((resolve) => {
    Dialog.create({
      component: ResponseErrorDialog,
      componentProps: {
        message,
        persistent: true,
      },
    }).onOk(() => resolve());
  });
}

function getMultipleErrorMessages(msgArr: string[]) {
  return msgArr.map((item) => {
    const msg = ErrorMessages.get(item);
    return msg ? `<p>${msg}</p>` : `<p>${item}</p>`;
  }).join('');
}
