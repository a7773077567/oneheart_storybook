import { type HttpHandler, HttpResponse, http } from 'msw';
import { faker } from '@faker-js/faker';
import { getUrl } from '@/utils/helpers';
import { getErrorRes, getSuccessRes } from '@/mocks/utils/response';
import { ShiftColors, ShiftTypes } from '@/api/shift';
import { useConvert } from '@/composables/helpers';

const { toObject } = useConvert(['startHr', 'startMin', 'endHr', 'endMin']);

export const getShiftHandler = http.get(getUrl('shift/:shiftId'), ({ params }) => {
  const { shiftId } = params;
  const ids = [1, 2, 3, 4];
  if (!ids.includes(+shiftId)) {
    return getErrorRes(403);
  }
  return HttpResponse.json({ data: getMockShift() });
});

export const createShiftHandler = http.post(getUrl('shift'), async ({ request }) => {
  const payload = await request.json();
  if (!payload) {
    return getErrorRes(422);
  }
  return getSuccessRes();
});

export const updateShiftHandler = http.put(getUrl('shift/:shiftId'), ({ params }) => {
  const { shiftId } = params;
  const ids = [1, 2, 3, 4];
  if (!ids.includes(+shiftId)) {
    return getErrorRes(403);
  }
  return getSuccessRes();
});

function getMockShift() {
  const shiftTypes = Object.values(ShiftTypes);
  const mockShiftNames = ['花花班', '班班有石斑', '宇智波班', '終極一班', '不想上班'];

  return {
    type: faker.number.int({ max: shiftTypes.length }),
    name: faker.helpers.arrayElement(mockShiftNames),
    duration: getDuration(),
    unavailable: getArray(faker.number.int({ max: 5 })).map(getDuration),
    color: faker.helpers.arrayElement(ShiftColors),
  };

  function getDuration() {
    return toObject([23, 59, 23, 59].map(max => faker.number.int({ max })));
  }
  function getArray(count: number) {
    return [...Array(count).keys()];
  }
}
export default [getShiftHandler, createShiftHandler, updateShiftHandler];
