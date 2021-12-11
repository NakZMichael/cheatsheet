import { ApplicationItem } from '../entities/items';
import { ApplicationOrder } from '../entities/order';
import { ApplicationUser } from '../entities/user';

export interface ApplicationData{
  users: ApplicationUser[],
  items: ApplicationItem[],
  orders: ApplicationOrder[],
}

export const APPLICATION_DATA: ApplicationData = {
  users: [{
    userName: 'nakz',
    password: 'test1234',
    firstName: 'nakz',
    lastName: 'NakZ',
    postCode: '000-000',
    address: 'Japan,Tokyo',
    birthDate: '2022-01-01',
    phoneNumber: '0120-111-111',
  }],
  items: [
    {
      id: '0001',
      name: 'Cheese burger',
      price: 500,
      stock: 100,
      type: 'normal',
      selectableToppingIds: ['1001'],
    },
    {
      id: '1001',
      name: 'Cheese',
      price: 200,
      stock: 100,
      type: 'topping',
      selectableToppingIds: [],
    },
  ],
  orders: [],
};
