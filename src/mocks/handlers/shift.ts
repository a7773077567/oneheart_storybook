import { type HttpHandler, HttpResponse, http } from 'msw';
import { faker } from '@faker-js/faker';
import { getUrl } from '@/utils/helpers';
import { getErrorRes, getSuccessRes } from '@/mocks/utils/response';
import { ShiftColors, type ShiftReq, type ShiftRes, ShiftTypes } from '@/api/shift';
import { useConvert } from '@/composables/helpers';

const { toObject } = useConvert(['startHr', 'startMin', 'endHr', 'endMin']);
const shiftData: [number, ShiftRes][] = getArray(10).map(idx => [idx, getMockShift(idx)]);
const shiftList = new Map(shiftData);

const getShiftListHandler = http.get(getUrl('shift'), () => {
  return HttpResponse.json({ data: [...shiftList.values()] });
});
const getShiftHandler = http.get(getUrl('shift/:shiftId'), ({ params }) => {
  const { shiftId } = params;
  const shift = shiftList.get(+shiftId);
  if (!shift) {
    return getErrorRes(403);
  }
  return HttpResponse.json({ data: shift });
});

const createShiftHandler = http.post(getUrl('shift'), async ({ request }) => {
  const payload = await request.json();
  if (!payload) {
    return getErrorRes(422);
  }
  return getSuccessRes();
});

const updateShiftHandler = http.put(getUrl('shift/:shiftId'), async ({ params, request }) => {
  const { shiftId } = params;
  const shift = shiftList.get(+shiftId);
  if (!shift) {
    return getErrorRes(403);
  }
  const payload = await request.json() as ShiftReq;
  shiftList.set(+shiftId, { ...payload, id: shift.id });
  return getSuccessRes();
});

const deleteShiftHandler = http.delete(getUrl('shift/:shiftId'), async ({ params }) => {
  const { shiftId } = params;
  const shift = shiftList.get(+shiftId);
  if (!shift) {
    return getErrorRes(403);
  }
  shiftList.delete(+shiftId);
  return getSuccessRes();
});

// function getMockShifts(count: number) {
//   const dataArr = getArray(count).map((_, idx) => getMockShift(idx + 1));
//   return count === 1 ? dataArr[0] : dataArr;
// }
function getMockShift(id: number): ShiftRes {
  const shiftTypes = Object.values(ShiftTypes);
  const mockShiftNames = ['花花班', '班班有石斑', '宇智波班', '終極一班', '不想上班'];

  return {
    id,
    type: faker.number.int({ max: shiftTypes.length }),
    name: faker.helpers.arrayElement(mockShiftNames),
    duration: toObject(getDuration()),
    unavailable: getUnavailable(faker.number.int({ max: 2 })).map(toObject),
    color: faker.helpers.arrayElement(ShiftColors),
  };
}
export function getDuration() {
  return [23, 59, 23, 59].map(max => faker.number.int({ max }));
}
export function getUnavailable(count: number) {
  return getArray(count).map(getDuration);
}

export function getArray(count: number) {
  return [...Array(count).keys()];
}
export default [getShiftHandler, createShiftHandler, updateShiftHandler, getShiftListHandler, deleteShiftHandler];
