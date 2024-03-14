import { HttpHandler, http } from 'msw';
import { getArray, getUrl } from '@/utils/helpers';
import { getErrorRes, getResponse } from '@/mocks/utils/response';
import { TherapyTypes } from '@/const/general';
import { faker } from '@faker-js/faker';
import type { Therapist } from '@/api/appointment';

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
    const count = faker.number.int({ min: 1, max: 5 });
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
  };
}

export default [fetchTherapyTypesHandler, fetchTherapistsHandler];
