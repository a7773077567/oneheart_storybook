import users from './users';
import appointments from './appointments';

export const ErrorMessages = new Map([
  ...users,
  ...appointments,
]);
