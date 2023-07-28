'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import classes from './edit.module.css';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '../common/button/button';
import {
   updatePasswordInfoSelector,
   updatePasswordInfoLoadingSelector,
   updatePasswordErrorSelector,
} from './editPassword.selector';
import { useForm, Controller } from 'react-hook-form';
import { useAppSelector, useAppDispatch } from '@/redux/store/hooks';
import { removerAccountPwdInfo } from '@/redux/features/accounts/accountSlice';
import CloseIcon from '@mui/icons-material/Close';
import { updateAccountPassword } from '@/redux/features/accounts/accountActions';
import { useParams } from 'next/navigation';

export interface ModalProps {
   open: boolean;
   onClose: () => void;
}
export interface Props {
   password: string;
}

const schema = yup.object({
   password: yup
      .string()
      .required('Account password is required')
      .matches(
         /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
         'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
      ),
});

const EditPasswordModel: React.FC<ModalProps> = ({ open, onClose }) => {
   const {
      handleSubmit,
      formState: { errors },
      control,
   } = useForm<Props>({
      defaultValues: {
         password: '',
      },
      resolver: yupResolver(schema),
   });

   const dispatch = useAppDispatch();
   const params = useParams();

   const submitHandler = function (data: Props) {
      if (!!params && !!params?.slug) {
         const userId = params.slug as string;

         dispatch(
            updateAccountPassword({
               password: data?.password,
               userId,
            }),
         );
      }
   };

   const updatePasswordInfo = useAppSelector(updatePasswordInfoSelector);
   const updatePasswordInfoLoading = useAppSelector(
      updatePasswordInfoLoadingSelector,
   );
   const updatePasswordError = useAppSelector(updatePasswordErrorSelector);

   useEffect(() => {
      return () => {
         dispatch(removerAccountPwdInfo());
      };
   }, []);

   if (!open) return null;

   return createPortal(
      <div className={classes['cn_div']}>
         <div className={classes['main_div']}>
            <CloseIcon onClick={onClose} className={classes['close_ic']} />
            <p className="mb-4">Set Password</p>
            <form onSubmit={handleSubmit(submitHandler)}>
               <Box sx={{ '& > :not(style)': { my: 1, width: '100%' } }}>
                  <Controller
                     name="password"
                     control={control}
                     render={({ field: { onChange, value } }) => (
                        <TextField
                           label="Password"
                           variant="outlined"
                           onChange={onChange}
                           value={value}
                        />
                     )}
                  />
                  {!!errors?.password?.message && (
                     <p className="text-sm text-red-500">
                        {errors?.password?.message}
                     </p>
                  )}
               </Box>
               <Button isLoading={updatePasswordInfoLoading}>
                  Set password
               </Button>
            </form>
            {!!updatePasswordInfo && updatePasswordInfo?.message && (
               <p className="text-sm">{updatePasswordInfo?.message}</p>
            )}
            {!!updatePasswordError && updatePasswordError?.message ? (
               Array.isArray(updatePasswordError?.message) ? (
                  updatePasswordError?.message.map((el) => (
                     <div key={el}>
                        <p className="text-sm text-red-500">{el}</p>
                     </div>
                  ))
               ) : (
                  <p className="text-sm text-red-500">
                     {updatePasswordError?.message}
                  </p>
               )
            ) : null}
         </div>
      </div>,
      document.body as HTMLElement,
   );
};

export default EditPasswordModel;
