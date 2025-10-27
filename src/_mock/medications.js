import { faker } from '@faker-js/faker';

import medicationsData from './medications.json';

export const medications = medicationsData.map((medication) => ({
  id: faker.string.uuid(),
  name: medication.name,
  stock: 32,
  price: medication.price,
  total_sales: 20,
  category: medication.category,
}));
