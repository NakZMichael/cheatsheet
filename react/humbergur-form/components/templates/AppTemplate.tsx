import {
  AppBar, Button, CardActions, CardContent, makeStyles, Toolbar, Typography,
} from '@material-ui/core';
import { Card } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Header } from '../organisms/header';
import { OrderCard } from '../organisms/order-card';
import { useAuth } from '../providers/auth';

export const AppTemplate = () => {
  const classes = useStyles();
  const router = useRouter();
  const { user, signOut } = useAuth();
  useEffect(() => {
    if (!user && router) {
      router.push('/sign-in');
    }
  }, [user]);
  return (
    <div>
      <Header />
      <main className={classes.main}>
        <OrderCard />
      </main>
    </div>
  );
};

function BasicCard() {
  return (
    <Card sx={{
      bgcolor: 'background.paper',
      boxShadow: 1,
      borderRadius: 1,
      p: 2,
      maxWidth: 500,
      minWidth: 300,
    }}
    >
      <CardContent>
        <Typography color="secondary" gutterBottom>
          Word of the Day
        </Typography>
        <Typography variant="h5" component="div">
          be

          lent
        </Typography>
        <Typography color="secondary">
          adjective
        </Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          a benevolent smile
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

const useStyles = makeStyles((theme) => ({
  main: {
    paddingTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
