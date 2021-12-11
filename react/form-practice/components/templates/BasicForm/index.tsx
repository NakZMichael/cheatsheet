import React from 'react';
import { useForm } from 'react-hook-form';

export interface BasicFormProps{

}

export const BasicForm = (props:BasicFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
    },
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    console.log({ errors });
  });

  return (
    <form onSubmit={onSubmit}>
      <input defaultValue="test" {...register('example')} />
      <input
        defaultValue="test"
        {...register('exampleRequired', {
          required: true,
        })}
      />
      <input type="submit" />

    </form>
  );
};
