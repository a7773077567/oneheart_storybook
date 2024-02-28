import { type HttpHandler, HttpResponse, type HttpResponseInit, http } from 'msw';
import { faker } from '@faker-js/faker';
import { getUrl } from '@/utils/helpers';
import type { BasicLoginReq, GoogleLoginReq, UserInfoRes } from '@/api/user';

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
  return HttpResponse.json({ data: {
    id: faker.string.nanoid(),
    email: faker.internet.email({ firstName: username }),
    username,
  } satisfies UserInfoRes });
});

export const googleLoginHandler = http.post(getUrl('user/google-login'), async ({ request }) => {
  const { code } = await request.json() as GoogleLoginReq;
  if (!code) {
    return getErrorRes(401);
  }
  return getTokenRes();
});

function getErrorRes(status: number) {
  const errorTexts = new Map([
    [401, 'Unauthorized'],
  ]);
  const httpOptions: HttpResponseInit = {
    status,
    statusText: errorTexts.get(status),
  };
  return new HttpResponse(null, httpOptions);
}

function getTokenRes() {
  return HttpResponse.json({ data: { token: faker.string.uuid() } });
}

export default [basicLoginHandler, googleLoginHandler, userInfoHandler];
