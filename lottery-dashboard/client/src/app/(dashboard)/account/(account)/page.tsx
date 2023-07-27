'use client';

import React, { useEffect, useState } from 'react';
import PageHeading from '@/components/common/pageHeading/PageHeading';
import { Box, LinearProgress, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux/store/hooks';
import {
   allAccountsErrorSelector,
   allAccountsLoadingSelector,
   allAccountsSelector,
} from './account.selector';
import { useSession } from 'next-auth/react';
import { getAllUsersAccounts } from '@/redux/features/accounts/accountActions';
import Error from '@/components/common/error/error';
import {
   Table,
   TableContainer,
   TableRow,
   TableHeader,
   NextAndPrevButtons,
   TableBody,
   TableChildContainer,
} from '@/components/common/table/table';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, AvatarImage } from '@/components/common/avatar/avatar';

const Row = [
   { heading: 'Email' },
   { heading: 'Avatar' },
   { heading: 'Account enable' },
   { heading: 'Created at' },
   { heading: 'Options' },
];

function page() {
   const [page, setPage] = useState(0);
   const router = useRouter();

   const { data: session } = useSession();
   const allAccountsLoading = useAppSelector(allAccountsLoadingSelector);
   const allAccountsError = useAppSelector(allAccountsErrorSelector);
   const allAccounts = useAppSelector(allAccountsSelector);

   const dispatch = useAppDispatch();

   const nextHandler = function () {
      setPage((prev) => prev + 1);
   };

   const prevHandler = function () {
      setPage((prev) => prev - 1);
   };

   const createNewAccount = function () {
      router.push(`/account/create`);
   };

   const editHandler = function (id: string) {
      router.push(`/account/${id}`);
   };

   useEffect(() => {
      if (!!session && session?.user && session?.user?._id) {
         dispatch(
            getAllUsersAccounts({ page: page, userId: session?.user._id }),
         );
      }
   }, [session, page]);

   return (
      <div>
         <PageHeading
            heading={'Welcome to dashboard'}
            pageName={'Users Account'}
            para={
               'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as'
            }
            menu={true}
            innerProps={
               <MenuItem onClick={createNewAccount}>
                  Create new account
               </MenuItem>
            }
         />
         <div className="px-3 py-3">
            {!!allAccountsError && allAccountsError?.message && (
               <Error data={allAccountsError?.message} />
            )}
            {!!allAccountsLoading && (
               <Box sx={{ width: '100%' }}>
                  <LinearProgress />
               </Box>
            )}
            {!!allAccounts && allAccounts?.success && allAccounts?.items ? (
               <TableContainer>
                  <TableChildContainer>
                     <Table>
                        <TableHeader>
                           <TableRow row={Row} />
                        </TableHeader>
                        <TableBody>
                           {allAccounts?.items.map((el) => (
                              <tr key={el?._id}>
                                 <td>{el?.email}</td>
                                 <td>
                                    <Avatar>
                                       <AvatarImage
                                          src={el?.avatar}
                                          alt="profile image"
                                       />
                                    </Avatar>
                                 </td>
                                 <td>{el?.accountEnable ? 'Yes' : 'No'}</td>
                                 <td>
                                    {dayjs(el?.createdAt).format(
                                       'DD MMMM YYYY m:h:ss A',
                                    )}
                                 </td>
                                 <td className="flex items-center space-x-2">
                                    <EditIcon
                                       className="text-sm text-gray-600 cursor-pointer"
                                       onClick={() => editHandler(el?._id)}
                                    />
                                 </td>
                              </tr>
                           ))}
                        </TableBody>
                     </Table>
                  </TableChildContainer>
                  <NextAndPrevButtons
                     prevHandler={prevHandler}
                     nextHandler={nextHandler}
                     nextAndPrev={true}
                     disablePrevbtn={page === 0 ? true : false}
                     disableNextbtn={
                        page >= allAccounts?.totalPages ? true : false
                     }
                  ></NextAndPrevButtons>
               </TableContainer>
            ) : null}
         </div>
      </div>
   );
}

export default page;
