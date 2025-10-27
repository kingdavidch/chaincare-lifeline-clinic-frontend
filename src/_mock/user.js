import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

export const users = [...Array(24)].map((_, index) => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  phone: faker.phone.number(),
  email: faker.internet.email(),
  status: sample(['active', 'expired', 'locked']),
  claims: 'https://link-to-user-claims',
}));
