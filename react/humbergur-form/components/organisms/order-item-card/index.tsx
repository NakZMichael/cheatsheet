import { Button, CardContent } from '@material-ui/core';
import { Card, CardActions, Typography } from '@mui/material';
import React from 'react';
import { ApplicationItem } from '../../../api/entities/items';

export interface OrderItemCardProps{
  item: ApplicationItem,
  selectItem: (item:ApplicationItem) => void;
}

export const OrderItemCard = (props: OrderItemCardProps) => {
  const { item, selectItem } = props;
  return (
    <Card>
      <CardContent>
        <Typography variant="h4">{ item.name}</Typography>
        <Typography>
          {item.price}
          {' '}
          円
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => selectItem(item)}>選択</Button>
      </CardActions>
    </Card>
  );
};
