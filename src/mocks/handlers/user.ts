import type { HttpHandler } from 'msw';
import { HttpResponse, http } from 'msw';
import { faker } from '@faker-js/faker';
import { getUrl } from '@/utils/helpers';
import type { LoginData, UserInfoRes } from '@/stores/login/types';

export const loginHandler: HttpHandler = http.post(getUrl('user/login'), async ({ request }) => {
  const { password, username } = await request.json() as LoginData;
  if (password !== '123' || username !== '123') {
    return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
  }
  return HttpResponse.json({ data: { token: faker.string.uuid() } });
});

export const userInfoHandler = http.get(getUrl('user/info'), async () => {
  const username = faker.internet.userName();
  return HttpResponse.json({ data: {
    id: faker.string.uuid(),
    email: faker.internet.email({ firstName: username }),
    username,
  } satisfies UserInfoRes });
});
