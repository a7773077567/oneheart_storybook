import type { HttpHandler } from 'msw';
import { HttpResponse, http } from 'msw';
import { faker } from '@faker-js/faker';
import { getUrl } from '@/utils/helpers';
import type { LoginReq, UserInfoRes } from '@/api/user';

export const loginHandler = http.post(getUrl('user/login'), async ({ request }) => {
  const { account, password } = await request.json() as LoginReq;
  if (password !== '123456' || account !== '123@gmail.com') {
    return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
  }
  return HttpResponse.json({ data: { token: faker.string.uuid() } });
});

export const userInfoHandler: HttpHandler = http.get(getUrl('user/info'), ({ request }) => {
  const hasToken = request.headers.get('authorization');
  if (!hasToken) {
    return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
  }
  const username = faker.internet.userName();
  return HttpResponse.json({ data: {
    id: faker.string.nanoid(),
    email: faker.internet.email({ firstName: username }),
    username,
  } satisfies UserInfoRes });
});
