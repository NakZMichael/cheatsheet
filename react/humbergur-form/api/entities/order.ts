import { ApplicationItem } from './items';
import { ApplicationUser } from './user';

export interface ApplicationOrder{
  id?: string,
  user: ApplicationUser,
  items: {
    item: ApplicationItem,
    toppings: ApplicationItem[]
  }[],
  status: ApplicationOrderStatus,
  createdAt?: string,
  updatedAt?:string,
}

export type ApplicationOrderStatus = 'progress'|'complete'|'cancelled'
