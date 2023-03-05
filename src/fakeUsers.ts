import { faker } from '@faker-js/faker';
import { User } from './types';

faker.setLocale('ru');

const fakeUsers = (itemCount: number = 50) =>
  Array.from<never, User>({ length: itemCount }, (_, index) => {
    const sex = faker.name.sexType();
    const avatar = faker.helpers.maybe(() => faker.image.imageUrl(100, 100, 'avatar', true), { probability: 0.7 });

    return {
      id: (index + 1).toString(),
      sex,
      lastName: faker.name.lastName(sex),
      firstName: faker.name.firstName(sex),
      ...(avatar !== undefined ? { avatar } : null),
      email: faker.helpers.unique(faker.internet.email),
      birthdate: faker.date.birthdate({ min: 10, max: 80, mode: 'age' }).toJSON(),
      phone: faker.phone.number('+380 (##) ###-##-##'),
    };
  });

export default fakeUsers;
