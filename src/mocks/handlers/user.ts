import { type HttpHandler, HttpResponse, type HttpResponseInit, http } from 'msw';
import { faker } from '@faker-js/faker';
import { getUrl } from '@/utils/helpers';
import type { BasicLoginReq, ForgetReq, GoogleLoginReq, Location, MicrosoftLoginReq, NewPasswordReq, UserInfoRes } from '@/api/user';

export const basicLoginHandler = http.post(getUrl('user/basic-login'), async ({ request }) => {
  const { account, password } = await request.json() as BasicLoginReq;
  if (password !== '123456' || account !== '123@gmail.com') {
    return getErrorRes(401);
  }
  return getTokenRes();
});

export const userInfoHandler = http.get(getUrl('user/info'), ({ request }) => {
  const hasToken = request.headers.get('authorization');
  if (!hasToken) {
    return getErrorRes(401);
  }
  const username = faker.internet.userName();
  const locations: Location[] = [
    { id: 1, name: '桃園館', type: 'clinic' },
    { id: 2, name: '台北館', type: 'clinic' },
    { id: 3, name: '新竹館', type: 'clinic' },
    { id: 4, name: '台北館', type: 'gym' },
    { id: 5, name: '桃園館', type: 'gym' },
  ];
  return HttpResponse.json({ data: {
    id: faker.string.nanoid(),
    username,
    email: faker.internet.email({ firstName: username }),
    avatar: faker.image.avatar(),
    locations: faker.helpers.arrayElements(locations, { min: 1, max: locations.length }),
  } satisfies UserInfoRes });
});

export const googleLoginHandler = http.post(getUrl('user/google-login'), async ({ request }) => {
  const { code } = await request.json() as GoogleLoginReq;
  if (!code) {
    return getErrorRes(401);
  }
  return getTokenRes();
});

export const microsoftLoginHandler = http.post(getUrl('user/microsoft-login'), async ({ request }) => {
  const { idToken } = await request.json() as MicrosoftLoginReq;
  if (!idToken) {
    return getErrorRes(401);
  }
  return getTokenRes();
});

export const forgetPasswordHandler = http.post(getUrl('user/forget'), async ({ request }) => {
  const { account } = await request.json() as ForgetReq;
  const emails = ['123@gmail.com'];
  if (!emails.includes(account)) {
    return getErrorRes(422);
  }
  return HttpResponse.json({ data: { state: 'Successful' } });
});

export const setNewPasswordHandler = http.post(getUrl('user/new-password'), async ({ request }) => {
  const { password, confirm } = await request.json() as NewPasswordReq;
  if (password !== confirm) {
    return getErrorRes(422, 'Password and confirm should be the same');
  }
  return getSuccessRes();
});

function getErrorRes(status: number, customText?: string) {
  const errorTexts = new Map([
    [401, 'Unauthorized'],
    [422, 'In valid Payload'],
  ]);
  const httpOptions: HttpResponseInit = {
    status,
    statusText: customText || errorTexts.get(status),
  };
  return new HttpResponse(null, httpOptions);
}

function getTokenRes() {
  return HttpResponse.json({ data: { token: faker.string.uuid() } });
}

function getSuccessRes() {
  return HttpResponse.json({ data: { state: 'success' } });
}

export default [basicLoginHandler, googleLoginHandler, userInfoHandler, microsoftLoginHandler, forgetPasswordHandler, setNewPasswordHandler];
