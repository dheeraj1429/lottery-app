import axios, { InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';
import { message } from 'antd';

const axiosInstance = axios.create({
   baseURL: process.env.NEXT_APP_BACKEND_URL,
});

const interceptorsRequestFunction = async function (
   config: any,
): Promise<InternalAxiosRequestConfig<any>> {
   const session = await getSession();
   if (session && session?.user && session.user?.accessToken) {
      config.headers.Authorization = `Bearer ${session.user?.accessToken}`;
   }
   return config;
};

axiosInstance.interceptors.request.use(
   interceptorsRequestFunction,
   function (error) {
      Promise.reject(error);
      console.log(error);
   },
);

// axiosInstance.interceptors.response.use(
//    function (response) {
//       const data = response?.data;
//       const msg = data?.message;
//       if (msg && data?.success) {
//          message.success(msg);
//       }
//       return response;
//    },
//    function (error) {
//       const msg = error.response?.data?.message;
//       if (msg && Array.isArray(msg)) {
//          msg.forEach((m) => message.error(m));
//       } else {
//          message.error(msg);
//       }
//       return error;
//    },
// );

export { axiosInstance };
