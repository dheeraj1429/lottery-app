'use client';

import React, { useEffect } from 'react';
import PageHeading from '@/components/common/pageHeading/PageHeading';
import Button from '@/components/common/button/button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Props } from '.';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { createNewRoleHandler } from '@/redux/features/roles/rolesAction';
import {
   createNewRoleLoadingSelector,
   createNewRoleErrorSelector,
} from './roles.selector';
import Error from '@/components/common/error/error';
import { removeRolesErrors } from '@/redux/features/roles/rolesSlice';

const roles = [
   { value: true, label: 'Yes' },
   { value: false, label: 'No' },
];

const schema = yup.object({
   roleName: yup.string().required(),
   isDefault: yup.boolean().required(),
});

export default function Page({ params }: { params: { slug: string } }) {
   const {
      handleSubmit,
      formState: { errors },
      control,
   } = useForm<Props>({
      defaultValues: {
         roleName: '',
         isDefault: false,
      },
      resolver: yupResolver(schema),
   });

   const dispatch = useAppDispatch();

   const createNewRoleLoading = useAppSelector(createNewRoleLoadingSelector);
   const createNewRoleError = useAppSelector(createNewRoleErrorSelector);

   const submitHandler = function (data: Props) {
      dispatch(createNewRoleHandler(data));
   };

   useEffect(() => {
      return () => {
         dispatch(removeRolesErrors());
      };
   }, []);

   return (
      <div>
         <PageHeading
            heading={'Welcome to dashboard'}
            pageName={!!params.slug ? 'Update role' : 'Create roles'}
            para={
               'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as'
            }
         />
         <div className="py-5">
            <form onSubmit={handleSubmit(submitHandler)}>
               <Box sx={{ '& > :not(style)': { my: 1, width: '100%' } }}>
                  <div className="flex items-center space-x-2">
                     <div className="w-full">
                        <Controller
                           name="roleName"
                           control={control}
                           render={({ field: { onChange, value } }) => (
                              <TextField
                                 onChange={onChange}
                                 value={value}
                                 label="Outlined"
                                 variant="outlined"
                                 className="w-full"
                              />
                           )}
                        />
                        {!!errors?.roleName?.message && (
                           <p className="text-sm text-red-500">
                              {errors?.roleName?.message}
                           </p>
                        )}
                     </div>
                     <div className="w-5/12">
                        <Controller
                           name="isDefault"
                           control={control}
                           render={({ field: { onChange, value } }) => (
                              <TextField
                                 select
                                 label="Select"
                                 className="w-full"
                                 onChange={onChange}
                                 value={value}
                              >
                                 {roles.map((option) => (
                                    <MenuItem
                                       key={option.label}
                                       value={option.value.toString()}
                                    >
                                       {option.label}
                                    </MenuItem>
                                 ))}
                              </TextField>
                           )}
                        />
                        {!!errors?.isDefault?.message && (
                           <p className="text-sm text-red-500">
                              {errors?.isDefault?.message}
                           </p>
                        )}
                     </div>
                  </div>
                  <div>
                     <Button
                        isLoading={createNewRoleLoading}
                        type="submit"
                        variation="login-button"
                     >
                        Save
                     </Button>
                  </div>
                  {!!createNewRoleError && createNewRoleError?.message && (
                     <Error data={createNewRoleError?.message} />
                  )}
               </Box>
            </form>
         </div>
      </div>
   );
}
