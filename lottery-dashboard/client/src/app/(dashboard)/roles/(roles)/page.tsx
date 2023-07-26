'use client';

import PageHeading from '@/components/common/pageHeading/PageHeading';
import { MenuItem } from '@mui/material';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
   Table,
   TableContainer,
   TableRow,
   TableHeader,
   NextAndPrevButtons,
   TableBody,
   TableChildContainer,
} from '@/components/common/table/table';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { useSession } from 'next-auth/react';
import { getAllRoles } from '@/redux/features/roles/rolesAction';
import {
   allRolesSelector,
   allRolesLoadingSelector,
   allRolesErrorSelector,
} from './roles.selector';
import Error from '@/components/common/error/error';
import CircularProgress from '@mui/material/CircularProgress';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';
import withRoles from '@/hoc/withRoles';

const Row = [
   { heading: 'Role name' },
   { heading: 'default' },
   { heading: 'Created At' },
   { heading: 'Options' },
];

function RolesList() {
   const router = useRouter();
   const dispatch = useAppDispatch();
   const { data: session } = useSession();

   const allRoles = useAppSelector(allRolesSelector);
   const allRolesLoading = useAppSelector(allRolesLoadingSelector);
   const allRolesError = useAppSelector(allRolesErrorSelector);

   const createNewAccount = function () {
      router.push('/roles/create');
   };

   useEffect(() => {
      if (session && session?.user && session?.user?._id) {
         dispatch(getAllRoles());
      }
   }, [session]);

   return (
      <div>
         <PageHeading
            heading={'Welcome to dashboard'}
            pageName={'Accounts roles'}
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
         <div>
            {!!allRolesLoading && (
               <div className="flex items-center justify-center p-3">
                  <CircularProgress size={'30px'} />
               </div>
            )}
            {!!allRolesError && allRolesError?.message && (
               <Error data={allRolesError?.message} />
            )}
            {!!allRoles &&
            allRoles?.success &&
            allRoles?.items &&
            allRoles?.items.length ? (
               <TableContainer>
                  <TableChildContainer>
                     <Table>
                        <TableHeader>
                           <TableRow row={Row} />
                        </TableHeader>
                        <TableBody>
                           {allRoles?.items.map((el) => (
                              <tr key={el?._id}>
                                 <td>{el?.roleName}</td>
                                 <td>{el?.default ? 'Yes' : 'No'}</td>
                                 <td>
                                    {dayjs(el?.createdAt).format(
                                       'DD MMMM YYYY m:h:ss A',
                                    )}
                                 </td>
                                 <td className="flex items-center space-x-2">
                                    <Link href={`/roles/${el?._id}`}>
                                       <EditIcon className="text-gray-800 text-sm cursor-pointer" />
                                    </Link>
                                 </td>
                              </tr>
                           ))}
                        </TableBody>
                     </Table>
                  </TableChildContainer>
                  <NextAndPrevButtons nextAndPrev={true}></NextAndPrevButtons>
               </TableContainer>
            ) : null}
         </div>
      </div>
   );
}

export default withRoles(RolesList, ['admin']);
