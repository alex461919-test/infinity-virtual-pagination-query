import { SexType } from '@faker-js/faker';

export interface User {
  id: string;
  sex: SexType;
  firstName: string;
  lastName: string;
  avatar?: string;
  email: string;
  birthdate: string;
  phone: string;
}
