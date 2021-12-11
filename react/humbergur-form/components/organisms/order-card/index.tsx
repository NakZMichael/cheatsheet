import React from 'react';
import {
  Button,
  Card, CardActions, CardContent, Typography,
} from '@mui/material';
import Link from 'next/link';

export const OrderCard = () => (
  <Card
    sx={{
      bgcolor: 'background.paper',
      boxShadow: 1,
      borderRadius: 1,
      p: 2,
      maxWidth: 500,
      minWidth: 300,
    }}
  >
    <CardContent>
      <Typography variant="h3" color="secondary" gutterBottom>
        注文する
      </Typography>
    </CardContent>
    <CardActions>
      <Link href="/create-order">
        <Button size="small">
          開始する。
        </Button>
      </Link>
    </CardActions>
  </Card>
);
