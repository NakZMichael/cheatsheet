import {
  Button, createStyles, IconButton, makeStyles, styled, TextField, Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import {
  Control, FormState, SubmitHandler, useFieldArray, useForm, UseFormGetValues, UseFormRegister,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import * as yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
// export interface OfficeBranch {
//   id: string,
//   name: string,
//   location: string,
// }

export interface FamilyMember{
  firstName: string,
  lastName: string,
  age:number,
  relation:string,
  phoneNumber: string
  photos: { imgSrc: string }[],
  numbers: {value:number}[],
}

export interface JobApplicationFormInput{
  firstName: string,
  lastName: string,
  phoneNumber: string,
  age:number,
  photos: { imgSrc:string }[]
  // desirableOfficeBranches: OfficeBranch[],
  familyMembers: FamilyMember[],
}

const defaultValues:JobApplicationFormInput = {
  firstName: '太郎',
  lastName: '山田',
  phoneNumber: '0120-111-111',
  photos: [],
  age: 25,
  familyMembers: [
    {
      firstName: '花子',
      lastName: '山田',
      relation: '妻',
      age: 25,
      phoneNumber: '0120-111-111',
      photos: [],
      numbers: [{ value: 10 }, { value: 20 }, { value: 30 }],
    },
  ],
};

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
  phoneNumber: yup.string().required('電話番号の入力は必須です').matches(phoneRegExp, '不正な電話番号です。'),
  familyMembers: yup.array().of(familySchema),
});

let renderedCount = 0;
export const JobApplicationForm = () => {
  renderedCount += 1;
  console.log({ renderedCount });
  const classes = useStyles();
  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: {
      errors,
    },
    watch,
  } = useForm<JobApplicationFormInput>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<JobApplicationFormInput> = (input) => {
    console.log({ input });
  };
  const {
    fields: photos, append: appendPhoto, insert, remove: removePhoto, update,
  } = useFieldArray({
    control,
    name: 'photos',
  });

  const { fields: familyMembers, append: appendFamilyMember } = useFieldArray({
    control,
    name: 'familyMembers',
  });
  const lastName = watch('lastName');
  return (
    <div className={classes.root}>
      lastName:
      {' '}
      {lastName}
      <form className={classes.form}>
        <TextField
          label="姓"
          className={classes.formItem}
          {...register('lastName')}
        />
        <TextField
          label="名"
          className={classes.formItem}
          {...register('firstName')}
        />
        <TextField
          label="電話番号"
          className={classes.formItem}
          error={!!errors.phoneNumber}
          {...register('phoneNumber')}
        />

        {errors.phoneNumber?.message && (
          <Typography
            variant="caption"
            color="error"
            className={classes.formItemCaption}
          >
            {errors.phoneNumber.message}
          </Typography>
        )}
        <TextField
          label="年齢"
          type="number"
          className={classes.formItem}
          error={!!errors.age}
          {...register('age')}
        />

        {errors.age?.message && (
          <Typography
            variant="caption"
            color="error"
            className={classes.formItemCaption}
          >
            {errors.age.message}
          </Typography>
        )}
        <Typography variant="h5">顔写真</Typography>
        {
          photos.map((photo, photoIndex) => (
            <PhotoPreview
              imgSrc={photo.imgSrc}
              remove={() => { removePhoto(photoIndex); }}
              key={photo.id}
            />
          ))
        }
        <div className={classes.formItem}>
          <label htmlFor="contained-button-file">
            <Input
              accept="image/*"
              id="contained-button-file"
              type="file"
              multiple
              onChange={async (event) => {
                event.preventDefault();

                const file = event.target.files?.item(0);
                const reader = new FileReader();
                reader.onloadend = () => {
                  appendPhoto({ imgSrc: reader.result as any });
                };
                if (file) {
                  reader.readAsDataURL(file);
                  // console.log({ filePath: await file.text() });
                  // appendPhoto({ filePath: file.webkitRelativePath });
                }
              }}
            />
            <Button variant="contained" component="span">
              Upload
            </Button>
          </label>
        </div>
        <Typography variant="h5">家族について</Typography>
        <div className={classes.family}>
          <Button
            onClick={() => {
              appendFamilyMember({});
            }}
            variant="outlined"
          >
            家族を追加
          </Button>

          {familyMembers.map((familyMember, familyMemberIndex) => (
            <FamilyMemberForm
              key={familyMember.id}
              familyMember={familyMember}
              control={control}
              register={register}
              familyMemberIndex={familyMemberIndex}
              errors={errors}
            />
          ))}
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="outlined"
        >
          送信
        </Button>
      </form>
    </div>
  );
};

interface PhotoPreviewProps{
  imgSrc: string;
  remove: () => void;
}

const PhotoPreview = ({
  imgSrc,
  remove,
}: PhotoPreviewProps) => (
  <div>
    <IconButton
      onClick={remove}
    >
      <DeleteIcon />
    </IconButton>
    <img alt="none" src={imgSrc} />
  </div>
);

interface FamilyMemberFormProps{
  control: Control<JobApplicationFormInput>,
  register: UseFormRegister<JobApplicationFormInput>,
  familyMemberIndex: number,
  familyMember:FamilyMember,
  errors:FormState<JobApplicationFormInput>['errors']
}

const FamilyMemberForm = ({
  control,
  register,
  familyMemberIndex,
  familyMember,
  errors,
}: FamilyMemberFormProps) => {
  const classes = useStyles();
  const {
    fields: photos, append: appendPhoto, insert, remove: removePhoto, update,
  } = useFieldArray({
    control,
    name: `familyMembers.${familyMemberIndex}.photos`,
  });
  const { fields: numbers } = useFieldArray({
    control,
    name: `familyMembers.${familyMemberIndex}.numbers`,
  });
  const fileInputId = `familyMembers.${familyMemberIndex}.photos`;
  return (
    <div className={classes.formItem}>
      <TextField
        label="応募者との関係"
        className={classes.formItem}
        {...register(`familyMembers.${familyMemberIndex}.relation`)}
      />
      <TextField
        label="姓"
        className={classes.formItem}
        {...register(`familyMembers.${familyMemberIndex}.lastName`)}
      />
      <TextField
        label="名"
        className={classes.formItem}
        {...register(`familyMembers.${familyMemberIndex}.firstName`)}
      />
      <TextField
        label="電話番号"
        className={classes.formItem}
        error={!!errors.familyMembers?.at(familyMemberIndex)?.phoneNumber?.message}
        {...register(`familyMembers.${familyMemberIndex}.phoneNumber`)}
      />

      {!!errors.familyMembers?.at(familyMemberIndex)?.phoneNumber?.message && (
      <Typography
        variant="caption"
        color="error"
        className={classes.formItemCaption}
      >
        {!!errors.familyMembers?.at(familyMemberIndex)?.phoneNumber?.message}
      </Typography>
      )}
      <TextField
        label="年齢"
        type="number"
        className={classes.formItem}
        error={!!errors.familyMembers?.at(familyMemberIndex)?.age?.message}
        {...register(`familyMembers.${familyMemberIndex}.age`)}
      />

      {errors.familyMembers?.at(familyMemberIndex)?.age?.message && (
      <Typography
        variant="caption"
        color="error"
        className={classes.formItemCaption}
      >
        {errors.familyMembers?.at(familyMemberIndex)?.age?.message}
      </Typography>
      )}
      {
        numbers.map((number_, numberIndex) => (
          <TextField
            key={number_.id}
            type="number"
            {...register(`familyMembers.${familyMemberIndex}.numbers.${numberIndex}.value`)}
          />
        ))
      }
      <Typography variant="h5">顔写真</Typography>
      {
          photos.map((photo, photoIndex) => (
            <PhotoPreview
              imgSrc={photo.imgSrc}
              remove={() => { removePhoto(photoIndex); }}
              key={photo.id}
            />
          ))
        }
      <div className={classes.formItem}>
        <label htmlFor={fileInputId}>
          <Input
            accept="image/*"
            id={fileInputId}
            type="file"
            multiple
            onChange={async (event) => {
              event.preventDefault();

              const file = event.target.files?.item(0);
              const reader = new FileReader();
              reader.onloadend = () => {
                appendPhoto({ imgSrc: reader.result as any });
              };
              if (file) {
                reader.readAsDataURL(file);
                // console.log({ filePath: await file.text() });
                // appendPhoto({ filePath: file.webkitRelativePath });
              }
            }}
          />
          <Button variant="contained" component="span">
            Upload
          </Button>
        </label>
      </div>
    </div>
  );
};

const Input = styled('input')({
  display: 'none',
});

const useStyles = makeStyles((theme) => ({
  root: {},
  form: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.spacing(2),
  },
  formItem: {
    display: 'block',
    marginBottom: theme.spacing(2),
  },
  formItemCaption: {
    display: 'block',
  },
  family: {
    paddingLeft: theme.spacing(4),
  },
}));
