import users from './users';
import appointments from './appointments';
import shifts from './shifts';
import userSettings from './userSettings';

export const ErrorMessages = new Map([
  ...users,
  ...appointments,
  ...shifts,
  ...userSettings,
]);
