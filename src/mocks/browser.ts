import { setupWorker } from 'msw/browser';
import userHandlers from './handlers/user';

export const worker = setupWorker(...userHandlers);

export function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return;
  }
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}
