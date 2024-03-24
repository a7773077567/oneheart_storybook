import { type HttpHandler, HttpResponse, http } from 'msw';
import { faker } from '@faker-js/faker';
import { getUrl } from '@/utils/helpers';
import { getErrorRes, getSuccessRes } from '@/mocks/utils/response';
import type { BasicLoginReq, ForgotReq, GoogleLoginReq, MicrosoftLoginReq, NewPasswordReq, User } from '@/api/user';

// export const basicLoginHandler = http.post(getUrl('user/basic-login'), async ({ request }) => {
//   const { email, password } = await request.json() as BasicLoginReq;
//   if (password !== '123456' || email !== '123@gmail.com') {
//     return getErrorRes(401);
//   }
//   return getTokenRes();
// });

// export const userInfoHandler = http.get(getUrl('user/info'), ({ request }) => {
//   const hasToken = request.headers.get('authorization');
//   if (!hasToken) {
//     return getErrorRes(401);
//   }
//   const name = faker.internet.userName();
//   const spaces: Location[] = [
//     { id: 1, name: '桃園館', type: 'clinic' },
//     { id: 2, name: '台北館', type: 'clinic' },
//     { id: 3, name: '新竹館', type: 'clinic' },
//     { id: 4, name: '台北館', type: 'gym' },
//     { id: 5, name: '桃園館', type: 'gym' },
//   ];
//   return HttpResponse.json({ data: {
//     id: faker.string.nanoid(),
//     name,
//     email: faker.internet.email({ firstName: name }),
//     avatar: faker.image.avatar(),
//     spaces: faker.helpers.arrayElements(spaces, { min: 1, max: spaces.length }),
//   } satisfies User });
// });

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

// export const forgotPasswordHandler = http.post(getUrl('user/forget'), async ({ request }) => {
//   const { email } = await request.json() as ForgotReq;
//   const emails = ['123@gmail.com'];
//   if (!emails.includes(email)) {
//     return getErrorRes(422);
//   }
//   return HttpResponse.json({ data: { state: 'Successful' } });
// });

// export const resetPasswordHandler = http.post(getUrl('user/new-password'), async ({ request }) => {
//   const { password, confirmPassword } = await request.json() as NewPasswordReq;
//   if (password !== confirmPassword) {
//     return getErrorRes(422, 'Password and confirm should be the same');
//   }
//   return getSuccessRes();
// });

function getTokenRes() {
  return HttpResponse.json({ data: { token: faker.string.uuid() } });
}

export default [
  // basicLoginHandler,
  googleLoginHandler,
  microsoftLoginHandler,
  // userInfoHandler,
  // forgotPasswordHandler,
  // resetPasswordHandler,
];
