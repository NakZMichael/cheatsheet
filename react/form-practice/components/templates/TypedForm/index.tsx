import React from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import * as yup from 'yup';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const familySchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  age: yup.number()
    .positive()
    .integer()
    .required('年齢は必須です。')
    .min(13, '13未満は登録できません。'),
  phoneNumber: yup.string().matches(phoneRegExp, '不正な電話番号です。'),
});
const schema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  age: yup.number()
    .positive()
    .integer()
    .required('年齢は必須です。')
    .min(13, '13未満は登録できません。'),
  phoneNumber: yup.string().matches(phoneRegExp, '不正な電話番号です。'),
  families: yup.array().of(familySchema),
});

export interface TypedFormInput{
  firstName: string,
  lastName: string,
  age: number,
  phoneNumber: string,
  families: {
    firstName: string,
    lastName: string,
    age: number,
    phoneNumber: string,
    colors: string[]
  }[]
}

const typedFormInputDefaultValues: TypedFormInput = {
  firstName: 'Michael',
  lastName: 'NakZ',
  age: 25,
  phoneNumber: '0120-111-111',
  families: [
    {
      firstName: 'Seller',
      lastName: 'NakZ',
      age: 22,
      phoneNumber: '0120-222-222',
      colors: ['#bf4f4f', '#5844a2'],
    },
  ],
};

export const TypedForm = () => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: {
      errors,
    },
  } = useForm<TypedFormInput>({
    defaultValues: typedFormInputDefaultValues,
  });

  const onSubmit: SubmitHandler<TypedFormInput> = (data) => {
    console.log({ ...data });
  };

  const {
    fields, append, remove, update,
  } = useFieldArray({
    control,
    name: 'families',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((family, familyIndex) => (
        <div key={family.id}>
          <label>first Name</label>
          <input
            type="text"
            {...register(`families.${familyIndex}.firstName`)}
          />
          <label>Last Name</label>
          <input
            type="text"
            {...register(`families.${familyIndex}.lastName`)}
          />
          <label>Phone Number</label>
          <input
            type="text"
            {...register(`families.${familyIndex}.phoneNumber`)}
          />
          <label>Age</label>
          <input
            type="number"
            {...register(`families.${familyIndex}.age`)}
          />
          <label>Colors</label>
          {
            family.colors.map((color, colorIndex) => (
              <input
                type="color"
                {...register(`families.${familyIndex}.colors.${colorIndex}`)}
              />
            ))
          }
          <input
            type="button"
            onClick={() => {
              // setValue(`families.${familyIndex}.colors`, [
              //   ...getValues().families[familyIndex].colors,
              //   '#bf4f4f',
              // ]);
              update(familyIndex, {
                ...family,
                colors: [...family.colors, '#bf4f4f'],
              });
            }}
            value="add color"
          />
        </div>
      ))}
      <input type="submit" />
    </form>
  );
};
