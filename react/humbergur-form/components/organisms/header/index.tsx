import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AppBar, Button, Toolbar } from '@material-ui/core';
import { useAuth } from '../../providers/auth';

export const Header = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  useEffect(() => {
    console.log(router.pathname);
    if (!user && !['sign-in', 'sign-up'].includes(router.pathname)) {
      router.push('/sign-in');
    }
  }, [user]);
  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Button
            variant="outlined"
            onClick={signOut}
          >
            サインアウト
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  );
};
