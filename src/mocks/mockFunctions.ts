// import { faker } from '@faker-js/faker';
// import type { Role, Space, User } from '@/api/user';
// import type { UserShift } from '@/api/shift';
// import type { Client, ClientSchedule } from '@/api/appointment';

// function getMockUser(id: number): User {
//   return {
//     id,
//     email: faker.internet.email(),
//     name: faker.person.firstName(),
//     role: getMockRole(id),
//     spaces: [...Array(2).keys()].map(getMockSpace),
//   };
// }

// function getMockRole(id: number): Role {
//   const names = ['管理者', '物理治療師', '運動教練'];
//   return {
//     id,
//     name: faker.helpers.arrayElement(names),
//     type: faker.number.int(1),
//   };
// }

// function getMockSpace(id: number): Space {
//   const names = ['物理治療台北館', '物理治療桃園館'];
//   return {
//     id,
//     name: faker.helpers.arrayElement(names),
//     type: faker.number.int({ min: 1, max: 2 }),
//   };
// }

// export function getMockClient(id: number): Client {
//   return {
//     id,
//     name: faker.person.firstName(),
//     phone: faker.phone.number(),
//     identityType: faker.number.int(),
//     identityNumber: `${faker.string.alpha({ casing: 'upper' })}${faker.number.int({ min: 9, max: 9 })}`,
//     birthDate: faker.date.birthdate().toISOString().slice(0, 10),
//     email: faker.internet.email(),
//     lineUserId: faker.string.uuid(),
//     isVerifiedBySMS: faker.datatype.boolean(),
//     associations: [],
//   };
// }

// export function getMockUserShift(id: number): UserShift {
//   const date = faker.date.between({ from: '2024-03-01', to: '2024-03-31' });
//   const startTime = faker.date.anytime({ refDate: date });
//   const endTime = faker.date.soon({ days: 1, refDate: startTime });

//   return {
//     id,
//     spaceId: faker.number.int({ min: 1, max: 2 }),
//     userId: faker.number.int({ min: 1, max: 2 }),
//     type: faker.number.int({ min: 1, max: 6 }),
//     name: '花花班',
//     date: date.toISOString().slice(0, 10),
//     startTime: startTime.toISOString().slice(11, 16),
//     endTime: endTime.toISOString().slice(11, 16),
//     notAvailableTimes: [...Array(faker.number.int(2)).keys()].map(() => ({
//       startTime: startTime.toISOString().slice(11, 16),
//       endTime: endTime.toISOString().slice(11, 16),
//     })),
//     color: faker.internet.color(),
//     maxClients: faker.number.int(20),
//   };
// }

// export function getMockClientSchedule(id: number): ClientSchedule {
//   return {
//     id,
//     client: getMockClient(id),
//     user: getMockUser(id),
//     userShift: getMockUserShift(id),
//     userShiftSlotId: faker.number.int(),
//     userShiftAppointmentId: faker.number.int(),
//     paymentState: faker.number.int({ min: 1, max: 2 }),
//     state: faker.number.int({ min: 1, max: 7 }),
//   };
// }
