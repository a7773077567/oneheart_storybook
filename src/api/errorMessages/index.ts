import users from './users';
import appointments from './appointments';
import shifts from './shifts';

export const ErrorMessages = new Map([
  ...users,
  ...appointments,
  ...shifts,
]);
