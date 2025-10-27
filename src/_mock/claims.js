import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

export const claims = [...Array(30)].map((_, index) => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  date: '31-07-2024',
  medication: 'Ibuprofen',
  cost: 5,
  status: sample(['approved', 'denied']),
}));
