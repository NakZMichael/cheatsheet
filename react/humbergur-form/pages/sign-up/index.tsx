import { useRouter } from 'next/router';
import React from 'react';
import { useAuth } from '../../components/providers/auth';
import { SignUpTemplate } from '../../components/templates/sign-up';

export default function SignIn() {
  const { signUp } = useAuth();
  const router = useRouter();
  const signUpProcedure:typeof signUp = async (user) => {
    await signUp(user);
    router.push('/sign-in/');
  };
  return (
    <SignUpTemplate
      signUp={signUpProcedure}
    />
  );
}
