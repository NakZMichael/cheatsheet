import React, { useEffect, useState } from 'react';
import {
  SubmitHandler, useFieldArray, useForm, UseFormReturn,
} from 'react-hook-form';

interface FormInput{
  firstName: string,
  lastName: string,
  friends: {
    firstName: string,
    lastName: string,
  }[]
}

export default function App() {
  const formMethods = useForm<FormInput>();
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
  } = formMethods;
  const onSubmit: SubmitHandler<FormInput> = (input) => {
    console.log({ input });
  };

  useEffect(() => {
    window.setTimeout(() => {
      reset({
        firstName: watch('firstName'),
        lastName: watch('lastName'),
      });
    }, 3000);
  }, []);
  const { fields: friends, append: appendFriend } = useFieldArray({
    control,
    name: 'friends',
  });
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register('firstName')} />
        <input type="text" {...register('lastName')} />
        <h2>友達</h2>
        {
          friends.map((frined, friendIndex) => (
            <FriendForm
              // eslint-disable-next-line react/no-array-index-key
              key={friendIndex}
              formMethods={formMethods}
              friendIndex={friendIndex}
            />
          ))
        }
        <button
          type="button"
          onClick={() => {
            appendFriend({
              firstName: '',
              lastName: '',
            });
          }}
        >
          友達を追加
        </button>
        <input type="submit" />
      </form>

    </div>
  );
}
interface FriendFormProps{
  friendIndex:number,
  formMethods:UseFormReturn<FormInput>
}

function FriendForm(props: FriendFormProps) {
  const { formMethods, friendIndex } = props;
  return (
    <>
      <input type="text" {...formMethods.register(`friends.${friendIndex}.firstName`)} />
      <input type="text" {...formMethods.register(`friends.${friendIndex}.lastName`)} />
    </>
  );
}
// interface AdditionalFormProps{
//   formMethods:UseFormReturn<FormInput>
//  }

// function AdditionalForm({ formMethods }: AdditionalFormProps) {
//   const { register } = formMethods;
//   return (
//     <div>
//       <input type="text" {...register('phoneNumber')} />
//     </div>
//   );
// }
// import React, { useEffect, useState } from 'react';
// import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
// import { setTimeout } from 'timers/promises';

// interface FormInput{
//   firstName: string,
//   lastName: string,
//   phoneNumber: string,
//   isPanelOpen: boolean,
// }

// export default function App() {
//   const [defaultValues, setDefaultValues] = useState<FormInput>();
//   useEffect(() => {
//     window.setTimeout(() => {
//       setDefaultValues({
//         firstName: 'nakazato',
//         lastName: 'nakazato',
//         phoneNumber: '0120-111-111',
//         isPanelOpen: true,
//       });
//     }, 5000);
//   }, []);
//   const formMethods = useForm<FormInput>({
//     defaultValues: {
//       isPanelOpen: false,
//     },
//   });
//   const {
//     register,
//     handleSubmit,
//     reset,
//     watch,
//     setValue,
//   } = formMethods;
//   useEffect(() => {
//     reset(defaultValues);
//   }, [defaultValues]);
//   const isPanelOpen = watch('isPanelOpen');
//   const onSubmit: SubmitHandler<FormInput> = (input) => {
//     if (input.isPanelOpen) {
//       console.log({
//         firstName: input.firstName,
//         lastName: input.lastName,
//         phoneNumber: input.phoneNumber,
//       });
//     } else {
//       console.log({
//         firstName: input.firstName,
//         lastName: input.lastName,
//       });
//     }
//   };
//   return (
//     <div>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <input type="text" {...register('firstName')} />
//         <input type="text" {...register('lastName')} />
//         <button
//           type="button"
//           onClick={() => { setValue('isPanelOpen', !isPanelOpen); }}
//         >
//           追加で入力する。
//         </button>
//         {isPanelOpen && <AdditionalForm formMethods={formMethods} />}
//         <input type="submit" />
//       </form>

//     </div>
//   );
// }

// interface AdditionalFormProps{
//   formMethods:UseFormReturn<FormInput>
//  }

// function AdditionalForm({ formMethods }: AdditionalFormProps) {
//   const { register } = formMethods;
//   return (
//     <div>
//       <input type="text" {...register('phoneNumber')} />
//     </div>
//   );
// }
