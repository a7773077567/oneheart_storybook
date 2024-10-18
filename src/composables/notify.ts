import { Notify } from 'quasar';

export function useNotify(message: string) {
  Notify.create({
    message,
    timeout: 2000,
    position: 'top',
  });
}
