'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@/components/common/button/button';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginInterface } from '.';
import { signIn } from 'next-auth/react';
import ErrorComponent from '@/components/common/error/error';
import { KnownError } from '@/types/interface';
import { useRouter } from 'next/navigation';

const schema = yup.object({
   email: yup.string().email().required('Please enter your email').lowercase(),
   password: yup
      .string()
      .required('Account password is required')
      .matches(
         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
         'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
      ),
});

function Login() {
   const {
      control,
      handleSubmit,
      formState: { errors },
   } = useForm<LoginInterface>({
      defaultValues: {
         email: '',
         password: '',
      },
      resolver: yupResolver(schema),
   });

   const router = useRouter();

   const [Error, setError] = useState<KnownError>({
      message: [],
   });
   const [Loading, setLoading] = useState(false);

   const submitHandler = async function (data: LoginInterface) {
      setLoading(true);
      setError({ message: [] });
      const response = await signIn('credentials', {
         email: data?.email,
         password: data?.password,
         redirect: false,
      });

      if (response) {
         if (!!response.error) {
            setLoading(false);
            const { error } = response;
            const errorMessage: KnownError = JSON.parse(error);
            setError({
               message: errorMessage?.message,
            });
         }

         if (!!response.ok && !response.error && response.status === 200) {
            setLoading(false);
            router.push('/');
         }
      }
   };

   return (
      <div>
         <h1 className=" mt-2 mb-4 font-medium text-4xl text-center text-gray-800">
            Login
         </h1>
         <div className="py-4 px-2">
            <form onSubmit={handleSubmit(submitHandler)}>
               <Box sx={{ '& > :not(style)': { my: 2, width: '100%' } }}>
                  <div className="w-full">
                     <Controller
                        name="email"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                           <TextField
                              onChange={onChange}
                              value={value}
                              className="w-full"
                              label="Email"
                              variant="outlined"
                           />
                        )}
                     />
                     {!!errors?.email?.message && (
                        <p className="tex-sm text-red-500">
                           {errors?.email?.message}
                        </p>
                     )}
                  </div>
                  <div className="w-full">
                     <Controller
                        name="password"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                           <TextField
                              onChange={onChange}
                              value={value}
                              label="Password"
                              className="w-full"
                              variant="outlined"
                           />
                        )}
                     />
                     {!!errors?.password?.message && (
                        <p className="tex-sm text-red-500">
                           {errors?.password?.message}
                        </p>
                     )}
                  </div>
                  <Button
                     isLoading={Loading}
                     type="submit"
                     variation="wallet_button"
                  >
                     Login
                  </Button>
                  {!!Error && Error?.message && (
                     <ErrorComponent data={Error?.message} />
                  )}
               </Box>
            </form>
         </div>
      </div>
   );
}

export default Login;
