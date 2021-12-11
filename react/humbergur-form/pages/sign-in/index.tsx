import { useRouter } from 'next/router';
import React from 'react';
import { useAuth } from '../../components/providers/auth';
import { SignInTemplate } from '../../components/templates/sign-in';
import Sample from '../../components/templates/Sample';

export default function SignIn() {
  const { signIn, user } = useAuth();
  console.log({ user });
  const router = useRouter();
  const signInProcedure:typeof signIn = async (params) => {
    await signIn(params);
    router.push('/');
  };
  return (
    <>
      <SignInTemplate
        signIn={signInProcedure}
      />
      <Sample />
    </>
  );
}
