'use client';

import React, { useEffect, useState } from 'react';
import PageHeading from '@/components/common/pageHeading/PageHeading';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/components/common/button/button';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import useRole from '@/hooks/useRole';
import { useSession } from 'next-auth/react';
import { getRolesWithId } from '@/redux/features/roles/rolesAction';
import {
   allRolesWithIdsSelector,
   allRolesWithIdsLoadingSelector,
   allRolesWithIdsErrorSelector,
   createNewAccountInfoSelector,
   createNewAccountLoadingSelector,
   createNewAccountErrorSelector,
   singleAccountSelector,
   accountUpdateLoadingSelector,
} from './account.selector';
import { LinearProgress, MenuItem } from '@mui/material';
import { Switch } from 'antd';
import { removeCreateAccountInfo } from '@/redux/features/accounts/accountSlice';
import { useParams } from 'next/navigation';
import {
   createNewAccount,
   getSelectedAccount,
   updateAccount,
} from '@/redux/features/accounts/accountActions';
import EditPasswordModel from '@/components/editPasswordPopup/editPasswordPopup';
import Error from '@/components/common/error/error';
import { message } from 'antd';

interface StateProps {
   email: string;
   accountEnable: boolean | undefined;
   role: string;
}

const schema = yup.object({
   email: yup.string().email().required('Please enter your email').lowercase(),
   accountEnable: yup.boolean(),
   role: yup.string().required('Role is required'),
});

function Page() {
   const {
      handleSubmit,
      formState: { errors },
      control,
      setValue,
   } = useForm<StateProps>({
      defaultValues: {
         email: '',
         accountEnable: false,
         role: '',
      },
      resolver: yupResolver(schema),
   });

   const [showPopup, setShowPopup] = useState(false);

   const params = useParams();
   const { data: session } = useSession();
   const { isAdmin } = useRole();
   const dispatch = useAppDispatch();

   const allRolesWithIds = useAppSelector(allRolesWithIdsSelector);
   const allRolesWithIdsLoading = useAppSelector(
      allRolesWithIdsLoadingSelector,
   );
   const allRolesWithIdsError = useAppSelector(allRolesWithIdsErrorSelector);
   const createNewAccountInfo = useAppSelector(createNewAccountInfoSelector);
   const createNewAccountLoading = useAppSelector(
      createNewAccountLoadingSelector,
   );
   const createNewAccountError = useAppSelector(createNewAccountErrorSelector);
   const singleAccount = useAppSelector(singleAccountSelector);
   const accountUpdateLoading = useAppSelector(accountUpdateLoadingSelector);

   const submitHandler = function (data: StateProps) {
      const userId = session?.user?._id;

      if (userId) {
         if (
            !!params &&
            params?.slug &&
            params?.slug &&
            params?.slug !== 'create'
         ) {
            const userId = params?.slug as string;
            const updatedData = Object.assign(data, { _id: userId });
            dispatch(updateAccount(updatedData));
         } else {
            const updatedData = Object.assign(data, { userId });
            dispatch(createNewAccount(updatedData));
         }
      }
   };

   useEffect(() => {
      if (isAdmin && !!session && session?.user && session?.user?._id) {
         dispatch(getRolesWithId({ userId: session?.user?._id }));
         if (
            !!params &&
            !!params?.slug &&
            params?.slug !== 'create' &&
            session?.user &&
            session?.user?._id
         ) {
            const userId = params?.slug as string;
            dispatch(getSelectedAccount({ userId: userId }));
         }
      }
   }, [isAdmin, session]);

   useEffect(() => {
      return () => {
         dispatch(removeCreateAccountInfo());
      };
   }, []);

   useEffect(() => {
      if (
         !!allRolesWithIds &&
         allRolesWithIds?.items &&
         params?.slug === 'create'
      ) {
         const role = allRolesWithIds?.items?.[0]?._id;
         setValue('role', role);
      }
   }, [allRolesWithIds]);

   useEffect(() => {
      if (!!singleAccount && singleAccount?.success && singleAccount?.item) {
         const { roleId, email, accountEnable } = singleAccount?.item;
         setValue('role', roleId);
         setValue('email', email);
         setValue('accountEnable', accountEnable);
      }
   }, [singleAccount]);

   return (
      <div>
         <PageHeading
            heading={'Welcome to dashboard'}
            pageName={'create Account'}
            para={
               'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as'
            }
         />
         <div className="mt-5">
            <EditPasswordModel
               open={showPopup}
               onClose={() => setShowPopup(false)}
            />
            <form onSubmit={handleSubmit(submitHandler)}>
               <Box sx={{ '& > :not(style)': { my: 1, width: '100%' } }}>
                  <div className="w-full flex items-center space-x-2">
                     <div className="w-full">
                        <Controller
                           name="email"
                           control={control}
                           render={({ field: { onChange, value } }) => (
                              <TextField
                                 className="w-full"
                                 onChange={onChange}
                                 value={value}
                                 label="Email"
                                 variant="outlined"
                              />
                           )}
                        />
                        {!!errors?.email?.message && (
                           <p className="text-sm text-red-500">
                              {errors?.email?.message}
                           </p>
                        )}
                     </div>
                     <div className="w-4/12">
                        {!!allRolesWithIdsError &&
                           allRolesWithIdsError?.message && (
                              <p className="text-sm text-red-500">
                                 {allRolesWithIdsError?.message}
                              </p>
                           )}
                        {!!allRolesWithIdsLoading && (
                           <Box sx={{ width: '100%' }}>
                              <LinearProgress />
                           </Box>
                        )}
                        {!!allRolesWithIds &&
                           allRolesWithIds?.success &&
                           allRolesWithIds?.items &&
                           allRolesWithIds?.items?.length && (
                              <>
                                 <Controller
                                    name="role"
                                    control={control}
                                    render={({
                                       field: { onChange, value },
                                    }) => (
                                       <TextField
                                          select
                                          label="Select"
                                          className="w-full"
                                          onChange={onChange}
                                          value={value}
                                       >
                                          {allRolesWithIds?.items.map(
                                             (option) => (
                                                <MenuItem
                                                   key={option._id}
                                                   value={option._id}
                                                >
                                                   {option.roleName}
                                                </MenuItem>
                                             ),
                                          )}
                                       </TextField>
                                    )}
                                 />
                                 {!!errors?.role?.message && (
                                    <p className="text-sm text-red-500">
                                       {errors?.role?.message}
                                    </p>
                                 )}
                              </>
                           )}
                     </div>
                  </div>
                  <div>
                     <Controller
                        name="accountEnable"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                           <div className="flex items-center space-x-2">
                              <Switch onChange={onChange} checked={value} />
                              <p>Account enable</p>
                           </div>
                        )}
                     />
                  </div>
                  <div>
                     <div className="flex space-x-2">
                        <Button
                           isLoading={
                              params?.slug === 'create'
                                 ? createNewAccountLoading
                                 : accountUpdateLoading
                           }
                           type={'submit'}
                        >
                           Save
                        </Button>
                        {!!params && params?.slug !== 'create' && (
                           <Button
                              type="button"
                              onClick={() => setShowPopup(true)}
                           >
                              Set password
                           </Button>
                        )}
                     </div>
                     {!!createNewAccountInfo &&
                        createNewAccountInfo?.message && (
                           <p className="text-gray-500 mt-3">
                              {createNewAccountInfo?.message}
                           </p>
                        )}
                     {!!createNewAccountError &&
                     createNewAccountError?.message ? (
                        <Error data={createNewAccountError?.message} />
                     ) : null}
                  </div>
               </Box>
            </form>
         </div>
      </div>
   );
}

export default Page;
