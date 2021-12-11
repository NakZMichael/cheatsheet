import React from 'react';
import { useForm, useFieldArray, FieldArray } from 'react-hook-form';
import { object, array, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';

const validationSchema = object().shape({
  questions: array()
    .of(
      object().shape({
        text: string().required('Some text is required'),
      }),
    )
    .required(),
});

type DefaultValueFormInput= {
  questions: {
    text:string
  }[],
  title: string
}

export const DefaultValueForm = () => {
  const {
    control,
    register,
    formState: { errors },
    clearErrors,
    setValue,
    unregister,
    handleSubmit,
    trigger,
  } = useForm<DefaultValueFormInput>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: '挨拶',
      questions: [
        {
          text: 'hello',
        },
        {
          text: 'world',
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const isInitialRender = React.useRef(true);
  const appendQuestion = () => {
    append({
      text: '',
    });

    // if (errors.questions? === 'min') {
    //   clearErrors('questions'); // always clear errors when a question is appended
    // }
  };

  React.useEffect(() => {
    if (!fields.length && !isInitialRender.current) {
      trigger('questions');
    }

    if (isInitialRender.current) {
      isInitialRender.current = false;
    }
  }, [fields, register, setValue, unregister, trigger]);

  return (
    <form onSubmit={handleSubmit((data) => console.log({ data }))}>
      <h1>Yup Validation - Field Array</h1>
      {fields.map((question, questionIndex) => (
        <div key={question.id}>
          <input
            {...register(`questions.${questionIndex}.text`)}
            // name={`questions[${questionIndex}].text`}
            // defaultValue=""
          />

          <button
            type="button"
            onClick={() => {
              remove(questionIndex);
              trigger();
            }}
          >
            Remove question
            {' '}
            {question.id}
          </button>
        </div>
      ))}
      <p>
        Errors:
        {console.log(errors)}
      </p>
      <button type="button" onClick={appendQuestion}>
        Add question
      </button>
      <input type="submit" />
    </form>
  );
};
