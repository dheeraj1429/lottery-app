import React from 'react';
import { IoIosArrowBack } from '@react-icons/all-files/io/IoIosArrowBack';
import { VscClose } from '@react-icons/all-files/vsc/VscClose';
import classes from './modelHeader.module.css';

interface Props {
   heading: string;
   backIcon?: React.ReactNode;
   cl?: string;
   back?: () => void;
   hideClBtn?: boolean;
}

function ModelHeader({ heading, backIcon, cl, back, hideClBtn }: Props) {
   return (
      <div
         className={`${classes['main_div']} flex items-center justify-between shadow ${cl}`}
      >
         <div className="flex items-center cursor-pointer" onClick={back}>
            {!backIcon ? null : <IoIosArrowBack />}
            <p className="ms-1">{heading}</p>
         </div>
         <div className="flex items-center">
            {hideClBtn ? null : <VscClose onClick={back} />}
         </div>
      </div>
   );
}

export default React.memo(ModelHeader);
