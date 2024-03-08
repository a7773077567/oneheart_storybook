import { setupWorker } from 'msw/browser';
import userHandlers from './handlers/user';
import shiftHandlers from './handlers/shift';

export const worker = setupWorker(...userHandlers, ...shiftHandlers);

export function enableMocking() {
  // if (import.meta.env.MODE !== 'development') {
  //   return;
  // }
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}
