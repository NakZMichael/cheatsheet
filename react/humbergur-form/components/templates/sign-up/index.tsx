import {
  Button, Grid, makeStyles, Paper, TextField, Typography,
} from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { Router } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '../../providers/auth';

const validationSchema = Yup.object().shape({
  password: Yup.string().required().min(6),
  password_confirmation: Yup.string().oneOf([Yup.ref('password'), null]).required(),
});

export interface SignUpTemplateProps{
  signUp: ReturnType<typeof useAuth>['signUp']
}
export interface SignUpFormFieldValues{
  userName: string,
  password: string,
  password_confirmation: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  postCode: string,
  address: string,
  birthDate:string,
}

export const SignUpTemplate = ({
  signUp,
}: SignUpTemplateProps) => {
  const classes = useStyles();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormFieldValues>({
    resolver: yupResolver(validationSchema),
  });
  const onSubmit: SubmitHandler<SignUpFormFieldValues> = async (data) => {
    await signUp(data);
  };
  console.log({ errors });
  const goBackHome = () => {
    router.push('/');
  };
  return (
  // <Grid
  //   container
  //   spacing={0}
  //   direction="column"
  //   alignItems="center"
  //   justify="center"
  //   style={{ height: '100%' }}
  // >
  //   <Grid item xs={2}>
  //   </Grid>

  // </Grid>
    <div className={classes.parent}>

      <Paper className={classes.root}>
        <form className={classes.form}>
          <Typography>サインアップ</Typography>
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
          <TextField
            label="パスワード(確認用)"
            type="password"
            className={classes.formInputItem}
            {...register('password_confirmation')}

          />
          {errors.password_confirmation && (
            <Typography color="error" style={{ display: 'block' }}>
              {errors.password_confirmation?.message}
            </Typography>
          )}
          <TextField
            label="氏"
            className={classes.formInputItem}
            {...register('lastName')}
          />
          <TextField
            label="名"
            className={classes.formInputItem}
            {...register('firstName')}
          />
          <TextField
            label="電話番号"
            className={classes.formInputItem}
            {...register('phoneNumber')}
          />
          <TextField
            label="郵便番号"
            className={classes.formInputItem}
            {...register('postCode')}
          />
          <TextField
            label="住所"
            className={classes.formInputItem}
            {...register('address')}
          />

          <Button
            className={classes.formInputItem}
            onClick={handleSubmit(onSubmit)}
            variant="outlined"
          >
            登録
          </Button>
          <Button
            className={classes.formInputItem}
            onClick={goBackHome}
            variant="outlined"
          >
            戻る
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
    minHeight: 400,
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
