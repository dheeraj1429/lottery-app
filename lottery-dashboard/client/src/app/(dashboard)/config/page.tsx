'use client';

import PageHeading from '@/components/common/pageHeading/PageHeading';
import React, { useEffect } from 'react';
import {
   accountConfigInfoSelector,
   accountConfigLoadingSelector,
   acocuntConfigErrorSelector,
   accountConfigUpdateInfoSelector,
   accountConfigUpdateLoadingSelector,
   accountConfigUpdateErrorSelector,
} from './config.selector';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/components/common/button/button';
import Error from '@/components/common/error/error';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { removeAccountConfigInfo } from '@/redux/features/accountConfig/accountConfigSlice';
import { useSession } from 'next-auth/react';
import {
   getAccountConfig,
   updateUserAccountConfig,
} from '@/redux/features/accountConfig/accountConfigActions';

export interface Props {
   clientId: string;
   userInfoApi: string;
   updateClientInformationApi: string;
}

const schema = yup.object({
   clientId: yup.string().required(),
   userInfoApi: yup.string().required(),
   updateClientInformationApi: yup.string().required(),
});

function Config() {
   const {
      handleSubmit,
      formState: { errors },
      setValue,
      control,
   } = useForm<Props>({
      defaultValues: {
         clientId: '',
         userInfoApi: '',
         updateClientInformationApi: '',
      },
      resolver: yupResolver(schema),
   });

   const { data: session } = useSession();
   const dispatch = useAppDispatch();

   const accountConfigInfo = useAppSelector(accountConfigInfoSelector);
   const accountConfigLoading = useAppSelector(accountConfigLoadingSelector);
   const acocuntConfigError = useAppSelector(acocuntConfigErrorSelector);
   const accountConfigUpdateInfo = useAppSelector(
      accountConfigUpdateInfoSelector,
   );
   const accountConfigUpdateLoading = useAppSelector(
      accountConfigUpdateLoadingSelector,
   );
   const accountConfigUpdateError = useAppSelector(
      accountConfigUpdateErrorSelector,
   );

   const submitHandler = function (data: Props) {
      if (!!session && session?.user?._id) {
         const savedObject = Object.assign(data, {
            userId: session?.user?._id,
         });
         dispatch(updateUserAccountConfig(savedObject));
      }
   };

   useEffect(() => {
      if (!!session && session?.user?._id) {
         dispatch(getAccountConfig({ userId: session?.user?._id }));
      }
   }, [session]);

   useEffect(() => {
      if (
         !!accountConfigInfo &&
         accountConfigInfo?.success &&
         accountConfigInfo?.userConfigInfo
      ) {
         const { clientId, userInfoApi, updateClientInformationApi } =
            accountConfigInfo?.userConfigInfo;
         setValue('clientId', clientId);
         setValue('userInfoApi', userInfoApi);
         setValue('updateClientInformationApi', updateClientInformationApi);
      }
   }, [accountConfigInfo]);

   useEffect(() => {
      return () => {
         dispatch(removeAccountConfigInfo());
      };
   }, []);

   return (
      <div>
         <PageHeading
            heading={'Welcome to dashboard'}
            pageName={'Accounts config'}
            para={
               'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as'
            }
         />
         {!!accountConfigLoading && (
            <div className="flex items-center justify-center p-5">
               <Box sx={{ display: 'flex' }}>
                  <CircularProgress />
               </Box>
            </div>
         )}
         {!!acocuntConfigError && acocuntConfigError?.message && (
            <Error data={acocuntConfigError?.message} />
         )}
         {!!accountConfigInfo &&
            accountConfigInfo?.success &&
            accountConfigInfo?.userConfigInfo && (
               <form onSubmit={handleSubmit(submitHandler)}>
                  <Box sx={{ '& > :not(style)': { my: 1, width: '100%' } }}>
                     <div className="flex items-center space-x-2">
                        <div className="w-3/12">
                           <p className="text-gray-700">Client Id :</p>
                        </div>
                        <Controller
                           name="clientId"
                           control={control}
                           render={({ field: { onChange, value } }) => (
                              <TextField
                                 className="w-full"
                                 onChange={onChange}
                                 value={value}
                                 disabled
                                 label="clientId"
                                 variant="outlined"
                              />
                           )}
                        />
                     </div>
                     <div className="flex items-center space-x-2 pt-5">
                        <div className="w-3/12">
                           <p className="text-gray-700">
                              Client information api :
                           </p>
                        </div>
                        <div className="w-full">
                           <Controller
                              name="userInfoApi"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                 <TextField
                                    className="w-full"
                                    onChange={onChange}
                                    value={value}
                                    label="client infromation"
                                    variant="outlined"
                                 />
                              )}
                           />
                           {!!errors?.userInfoApi?.message && (
                              <p className="text-sm text-red-500 mt-1">
                                 {errors?.userInfoApi?.message}
                              </p>
                           )}
                        </div>
                     </div>
                     <div className="flex items-center space-x-2 pt-5">
                        <div className="w-3/12">
                           <p className="text-gray-700">
                              Client Information update api :
                           </p>
                        </div>
                        <div className="w-full">
                           <Controller
                              name="updateClientInformationApi"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                 <TextField
                                    className="w-full"
                                    onChange={onChange}
                                    value={value}
                                    label="client infromation"
                                    variant="outlined"
                                 />
                              )}
                           />
                           {!!errors?.updateClientInformationApi?.message && (
                              <p className="text-sm text-red-500 mt-1">
                                 {errors?.updateClientInformationApi?.message}
                              </p>
                           )}
                        </div>
                     </div>
                     <div className="flex py-4">
                        <Button
                           type="submit"
                           isLoading={accountConfigUpdateLoading}
                        >
                           Save
                        </Button>
                     </div>
                  </Box>
                  {!!accountConfigUpdateInfo &&
                     accountConfigUpdateInfo?.success &&
                     accountConfigUpdateInfo?.message && (
                        <p className="text-sm mt-2">
                           {accountConfigUpdateInfo?.message}
                        </p>
                     )}
                  {!!accountConfigUpdateError &&
                     accountConfigUpdateError?.message && (
                        <Error data={accountConfigUpdateError?.message!} />
                     )}
               </form>
            )}
      </div>
   );
}

export default Config;
