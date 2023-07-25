import PageHeading from '@/components/common/pageHeading/PageHeading';
import React from 'react';

function RolesList() {
   return (
      <div>
         <PageHeading
            heading={'Welcome to dashboard'}
            pageName={'Accounts roles'}
            para={
               'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as'
            }
            menu={true}
         />
      </div>
   );
}

export default RolesList;
