import { Button, CardContent } from '@material-ui/core';
import { Card, CardActions, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Control, useFieldArray, UseFormReturn } from 'react-hook-form';
import { ApplicationItem } from '../../../api/entities/items';
import { ItemsApi } from '../../../api/items';
import { CreateOrderFormFieldValues } from '../../templates/create-order';

export interface SelectedItemCardProps{
  itemIndex:number,
  formMethods:UseFormReturn<CreateOrderFormFieldValues>
}

export const SelectedItemCard = (props: SelectedItemCardProps) => {
  const {
    itemIndex, formMethods,
  } = props;
  const { watch } = formMethods;
  const item = watch(`items.${itemIndex}`);
  const { fields: toppings, append: appendToppingIds } = useFieldArray({
    control: formMethods.control,
    name: `items.${itemIndex}.toppings`,
  });
  const [allToppings, setAllToppings] = useState<ApplicationItem[]>([]);
  const fetchAllToppings = async () => {
    const fetchedAllToppings = await ItemsApi.getToppings();
    setAllToppings(fetchedAllToppings);
  };
  useEffect(() => {
    fetchAllToppings();
  }, []);
  const { remove: removeItem, update: updateItem } = useFieldArray({
    control: formMethods.control,
    name: 'items',
  });
  if (!item) {
    return null;
  }
  return (
    <Card>
      <CardContent>
        <Typography>{item.item.name}</Typography>
        <Typography>{`個数: ${item.count}`}</Typography>
        <Typography>トッピング</Typography>
        {toppings.map((toppingId, toppingIndex) => {
          const topping = allToppings.find((top) => top.id === toppingId.id);
          return (
            <div key={toppingId.id}>
              <Typography>{ topping?.name }</Typography>
            </div>
          );
        })}
        <Typography>トッピングを追加</Typography>
        {allToppings.filter((topping) => item.item.selectableToppingIds
          .includes(topping.id)).map((topping) => (
            <div key={topping.id}>
              <Typography>{topping.name}</Typography>
              <Button onClick={() => {
                appendToppingIds(topping);
              }}
              >
                追加
              </Button>
            </div>
        ))}
      </CardContent>
      <CardActions>
        <Button onClick={() => removeItem(itemIndex)}>削除</Button>
        <Button onClick={() => {
          updateItem(itemIndex, {
            ...item,
            count: item.count + 1,
          });
        }}
        >
          追加
        </Button>
      </CardActions>
    </Card>
  );
};
