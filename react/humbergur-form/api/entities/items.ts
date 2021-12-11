export interface ApplicationItem{
  id: string,
  name: string,
  price: number,
  stock: number,
  type: ApplicationItemType,
  selectableToppingIds:string[],
}

export type ApplicationItemType = 'normal'| 'topping'
