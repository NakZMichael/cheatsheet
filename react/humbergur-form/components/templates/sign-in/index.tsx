import {
  Button, Grid, makeStyles, Paper, TextField, Typography,
} from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../providers/auth';

export interface SignInTemplateProps{
  signIn: ReturnType<typeof useAuth>['signIn']
}
export interface SignInFormFieldValues{
  userName: string,
  password: string,
}

export const SignInTemplate = ({
  signIn,
}: SignInTemplateProps) => {
  const classes = useStyles();
  const { user } = useAuth();
  const { register, handleSubmit } = useForm<SignInFormFieldValues>({
    defaultValues: {
      userName: user?.userName,
      password: user?.password,
    },
  });
  const onSubmit: SubmitHandler<SignInFormFieldValues> = async (data) => {
    await signIn(data);
  };
  return (
    <div className={classes.parent}>

      <Paper className={classes.root}>
        <form className={classes.form}>
          <Typography>ログイン</Typography>
          <TextField
            label="ユーザー名"
            className={classes.formInputItem}
            {...register('userName')}
          />
          <TextField
            label="パスワード"
            type="password"
            className={classes.formInputItem}
            {...register('password')}
          />
          <Typography
            className={classes.formInputItem}
            variant="caption"
            color="primary"
          >
            <Link href="/sign-up">
              サインアップ
            </Link>
          </Typography>
          <Button
            className={classes.formInputItem}
            onClick={handleSubmit(onSubmit)}
            variant="outlined"
          >
            ログイン
          </Button>
        </form>
      </Paper>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  parent: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  root: {
    width: 400,
    height: 400,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    margin: 'auto',
    // transform: 'translateY(-50%)',
    width: 'fit-content',
  },
  formInputItem: {
    display: 'block',
    marginBottom: theme.spacing(2),
  },
}));
