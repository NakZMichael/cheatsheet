import { Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { ApplicationItem } from '../../../api/entities/items';
import { ItemsApi } from '../../../api/items';
import { Header } from '../../organisms/header';
import { OrderItemCard } from '../../organisms/order-item-card';
import { SelectedItemCard } from '../../organisms/selected-item-card';

export interface CreateOrderFormFieldValues{
  items: {
    item: ApplicationItem,
    toppings: ApplicationItem[],
    count:number
  }[]
}

export const CreateOrderTemplate = () => {
  const [items, setItems] = useState<ApplicationItem[]>([]);
  const fetchItems = async () => {
    const fetchedItems = await ItemsApi.getItems();
    console.log({ fetchItems });
    setItems(fetchedItems);
  };
  useEffect(() => {
    fetchItems();
  }, []);

  const formMethods = useForm<CreateOrderFormFieldValues>();
  const { register, control, formState: { errors } } = formMethods;

  const {
    fields: selectedItems,
    append: appendSelectedItem,
    update: updateSelectedItem,
    remove: removeSelectedItem,
  } = useFieldArray({
    control,
    name: 'items',
  });
  return (
    <>
      <Header />
      <div>
        <div>
          {items.map((item) => (
            <div>
              <OrderItemCard
                key={item.id}
                item={item}
                selectItem={(input) => {
                  appendSelectedItem({
                    item: input,
                    toppings: [],
                    count: 0,
                  });
                }}
              />
            </div>
          ))}
        </div>
        <div>
          <Typography>選択された商品</Typography>
          {
            selectedItems.map((selectedItem, selectedItemIndex) => (
              <div key={selectedItem.id}>
                <SelectedItemCard
                  formMethods={formMethods}
                  index={selectedItemIndex}
                />
              </div>
            ))
          }
        </div>
      </div>
    </>
  );
};
