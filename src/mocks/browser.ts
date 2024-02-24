import { setupWorker } from 'msw/browser';
import { loginHandler, userInfoHandler } from './handlers/user';

export const worker = setupWorker(loginHandler, userInfoHandler);

export function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return;
  }
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}
