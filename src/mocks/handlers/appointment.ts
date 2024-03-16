import { HttpHandler, http } from 'msw';
import { getArray, getUrl } from '@/utils/helpers';
import { getErrorRes, getResponse } from '@/mocks/utils/response';
import { TherapyTypes } from '@/const/general';
import { faker } from '@faker-js/faker';
import type { BookingItem, Therapist } from '@/api/appointment';

const therapists = new Map(getTherapists());

// ========== Handlers ==========
const fetchTherapyTypesHandler = http.get(getUrl('appointment/therapy-types'), () => {
  const therapyTypes = Object.values(TherapyTypes);
  return getResponse({ therapyTypes });
});

const fetchTherapistsHandler = http.get(getUrl('appointment/therapists/:typeId'), ({ params }) => {
  const { typeId } = params;
  const hasType = therapists.has(+typeId);
  if (!hasType) {
    return getErrorRes(403);
  }
  const target = therapists.get(+typeId);
  return getResponse({ therapists: target });
});

// ========== Utils ==========
function getTherapists() {
  const typeIds = [...Object.keys(TherapyTypes).keys()];

  const therapists = typeIds.map((typeId) => {
    const count = 5;
    const therapists = getArray(count).map(id => getTherapist(id, typeId));
    return [typeId, therapists] as const;
  });
  return therapists;
}

function getTherapist(id: number, type: number): Therapist {
  return {
    id,
    type,
    name: faker.person.firstName(),
    avatar: faker.image.avatar(),
  };
}

export function getBookingItems() {
  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  return getArray(45).map<BookingItem>((id) => {
    faker.seed();
    const available = faker.datatype.boolean({ probability: 0.8 });
    const isBooked = available ? faker.datatype.boolean({ probability: 0.2 }) : false;
    const employeeId = Math.floor(id / 9);
    faker.seed(employeeId);
    return {
      id,
      date: '2024-03-16',
      time: times[id % 9],
      available,
      isBooked,
      employee: {
        id: employeeId,
        avatar: faker.image.avatar(),
        name: faker.person.firstName(),
      },
    };
  },
  );
}

export default [fetchTherapyTypesHandler, fetchTherapistsHandler];
