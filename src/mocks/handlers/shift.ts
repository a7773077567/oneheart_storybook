import { type HttpHandler, HttpResponse, http } from 'msw';
import { faker } from '@faker-js/faker';
import { getArray, getUrl } from '@/utils/helpers';
import { getErrorRes, getSuccessRes } from '@/mocks/utils/response';
import { type Employee, type EmployeeShiftRes, ShiftColors, type ShiftReq, type ShiftRes, type createEmployeeShiftsReq } from '@/api/shift';
import { useConvert } from '@/composables/helpers';
import { TherapyTypes } from '@/const/general';

const { toObject } = useConvert(['startHr', 'startMin', 'endHr', 'endMin']);
const shiftsData: [number, ShiftRes][] = getArray(5).map(idx => [idx, getMockShift(idx)]);
const shifts = new Map(shiftsData);
const employeeShiftsData: [number, EmployeeShiftRes][] = getArray(80).map(idx => [idx, getMockEmployeeShifts(idx)]);
const employeeShifts = new Map(employeeShiftsData);

// ========== Handlers ==========
// const fetchShiftTemplatesHandler = http.get(getUrl('shift'), () => {
//   return HttpResponse.json({ data: [...shifts.values()] });
// });

// const fetchShiftTemplateHandler = http.get(getUrl('shift/:shiftId'), ({ params }) => {
//   const { shiftId } = params;
//   const shift = shifts.get(+shiftId);
//   if (!shift) {
//     return getErrorRes(403);
//   }
//   return HttpResponse.json({ data: shift });
// });

// const createShiftTemplateHandler = http.post(getUrl('shift'), async ({ request }) => {
//   const payload = await request.json() as ShiftReq;
//   if (!payload) {
//     return getErrorRes(422);
//   }
//   const newShift = {
//     ...payload,
//     id: shifts.size,
//   };
//   shifts.set(shifts.size, newShift);
//   return getSuccessRes();
// });

// const updateShiftHandler = http.put(getUrl('shift/:shiftId'), async ({ params, request }) => {
//   const { shiftId } = params;
//   const shift = shifts.get(+shiftId);
//   if (!shift) {
//     return getErrorRes(403);
//   }
//   const payload = await request.json() as ShiftReq;
//   shifts.set(shift.id, { ...payload, id: shift.id });
//   return getSuccessRes();
// });

// const deleteShiftHandler = http.delete(getUrl('shift/:shiftId'), async ({ params }) => {
//   const { shiftId } = params;
//   const shift = shifts.get(+shiftId);
//   if (!shift) {
//     return getErrorRes(403);
//   }
//   shifts.delete(+shiftId);
//   return getSuccessRes();
// });

// const fetchEmployeesHandler = http.get(getUrl('employee'), () => {
//   const employees: Employee[] = getArray(5).map((_, idx) => {
//     return {
//       id: idx,
//       name: faker.person.firstName(),
//       avatar: faker.image.avatar(),
//     };
//   });
//   return HttpResponse.json({ data: employees });
// });

// const fetchEmployeeShiftsHandler = http.get(getUrl('employee/shift'), () => {
//   return HttpResponse.json({ data: [...employeeShifts.values()] });
// });

// const createUserShiftsHandler = http.post(getUrl('shift/:employeeId'), async ({ request, params }) => {
//   const { employeeId } = params;
//   const { date, shiftIds } = await request.json() as createEmployeeShiftsReq;
//   shiftIds.forEach((shiftId) => {
//     const employeeShift: EmployeeShiftRes = {
//       id: employeeShifts.size,
//       date,
//       employeeId: +employeeId,
//       shift: shifts.get(shiftId)!,
//     };
//     employeeShifts.set(employeeShifts.size, employeeShift);
//   });
//   return getSuccessRes();
// });

const deleteEmployeeShiftHandler = http.delete(getUrl('employee/shift/:employeeShiftId'), ({ params }) => {
  const { employeeShiftId } = params;
  if (!employeeShifts.has(+employeeShiftId)) {
    return getErrorRes(403);
  }
  employeeShifts.delete(+employeeShiftId);
  return getSuccessRes();
});

// ========== Utils ==========
export function getMockShift(id: number): ShiftRes {
  const shiftTypes = Object.values(TherapyTypes);
  const mockShiftNames = ['花花班', '班班有石斑', '宇智波班', '終極一班', '不想上班'];

  return {
    id,
    type: faker.number.int({ max: shiftTypes.length }),
    name: mockShiftNames[id],
    duration: toObject(getDuration()),
    unavailable: getUnavailable(faker.number.int({ max: 2 })).map(toObject),
    color: faker.helpers.arrayElement(ShiftColors),
  };
}

export function getMockEmployeeShifts(id: number): EmployeeShiftRes {
  return {
    id,
    shift: shifts.get(faker.number.int({ max: shifts.size - 1 }))!,
    date: faker.date.between({ from: '2024-03-01T00:08:00Z', to: '2024-03-31T00:00:00Z' }),
    employeeId: faker.number.int({ min: 0, max: 4 }),
  };
}

export function getDuration() {
  return [23, 59, 23, 59].map(max => faker.number.int({ max }));
}
export function getUnavailable(count: number): number[][] {
  return getArray(count).map(getDuration);
}

export default [
  // fetchShiftTemplateHandler,
  // createShiftTemplateHandler,
  // updateShiftHandler,
  // fetchShiftTemplatesHandler,
  // deleteShiftHandler,
  // fetchEmployeesHandler,
  // fetchEmployeeShiftsHandler,
  // createUserShiftsHandler,
  deleteEmployeeShiftHandler,
];
