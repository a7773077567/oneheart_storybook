import type { HttpHandler } from 'msw';
import { loginHandler, userInfoHandler } from './user';

export const handlers: HttpHandler[] = [
  loginHandler,
  userInfoHandler,
];
