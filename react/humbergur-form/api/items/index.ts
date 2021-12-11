import { APPLICATION_DATA } from '../data';

export class ItemsApi {
  static getItems = async () => APPLICATION_DATA.items;

  static getToppings = async () => APPLICATION_DATA.items.filter((item) => item.type === 'topping');
}
