import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import * as yup from 'yup';

enum GenderEnum {
  female = 'female',
  male = 'male',
  other = 'other'
}

interface IFormInput {
  firstName: string;
  lastName: string;
  gender: GenderEnum;
  age:number,
}
const schema = yup.object({
  firstName: yup.string().required(),
  age: yup.number().positive().integer().min(18, '18歳以下は登録できません。')
    .required(),
}).required();

export const ValidationForm = () => {
  const {
    register, handleSubmit, formState: {
      errors,
    },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });
  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>First Name</label>
      <input
        {...register('firstName', {
          required: 'This field is required!',
          maxLength: 20,
        })}
        aria-invalid={errors.firstName ? 'true' : 'false'}
      />
      {
        errors && errors.firstName?.message
      }
      {errors.firstName && errors.firstName.type === 'required' && (
        <span role="alert">This is required</span>
      )}
      <label>Last Name</label>
      <input
        {...register('lastName', {
          pattern: /^[A-Za-z]+$/i,
        })}
      />
      <label>Gender Selection</label>
      <select {...register('gender')}>
        <option value="female">female</option>
        <option value="male">male</option>
        <option value="other">other</option>
      </select>
      <label>Age</label>
      <input
        type="number"
        {...register('age', {
          // min: 18,
          max: 99,
        })}
      />
      <p>{errors.age?.message}</p>
      <input type="submit" />
    </form>
  );
};
