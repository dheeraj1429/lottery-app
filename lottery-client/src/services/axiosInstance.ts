import store from '@/redux/store/store';
import axios from 'axios';
// import { message } from 'antd';

const axiosInstance = axios.create({
   baseURL: process.env.NEXT_APP_BACKEND_URL,
});

axiosInstance.interceptors.request.use((config) => {
   const _store = store.getState();
   const accessToken = _store?.client?.user?.token;
   if (!!accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
   }
   return config;
});

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
