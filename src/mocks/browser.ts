import { setupWorker } from 'msw/browser';
import userHandlers from './handlers/user';
import shiftHandlers from './handlers/shift';
import appointmentHandlers from './handlers/appointment';

export const worker = setupWorker(...userHandlers, ...shiftHandlers, ...appointmentHandlers);

export function enableMocking() {
  // if (import.meta.env.MODE !== 'development') {
  //   return;
  // }
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}
