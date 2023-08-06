import React from 'react';
import classes from './table.module.css';
import Button from '../button/button';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { cn } from '@/lib/utils';

export type Props = {
   nextAndPrev?: boolean;
   nextHandler?: () => void;
   prevHandler?: () => void;
   disablePrevbtn?: boolean;
   disableNextbtn?: boolean;
};
export interface TableContainerInterface
   extends React.HTMLAttributes<HTMLDivElement> {
   cl?: string;
}
export interface TableInterface
   extends React.TableHTMLAttributes<HTMLTableElement> {}
export interface TableRowInterface
   extends React.HTMLAttributes<HTMLTableRowElement> {
   row: { heading: string; cls?: string }[];
}
export interface TableHeaderInterface
   extends React.HTMLAttributes<HTMLTableSectionElement> {}
export interface TableBodyInterface
   extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableContainer = React.forwardRef<
   HTMLDivElement,
   TableContainerInterface
>(({ cl, children, ...props }, ref) => {
   return (
      <div {...props} ref={ref} className={!!cl ? cl : classes['table_div']}>
         {children}
      </div>
   );
});

const TableChildContainer = React.forwardRef<
   HTMLDivElement,
   TableContainerInterface
>(({ children, ...props }, ref) => {
   return (
      <div ref={ref} {...props} className={`${classes['table_cm']} shadow-lg`}>
         {children}
      </div>
   );
});

const Table = React.forwardRef<HTMLTableElement, TableInterface>(
   ({ children, className, ...props }, ref) => {
      return (
         <table className={cn('w-full', className)} ref={ref} {...props}>
            {children}
         </table>
      );
   },
);

const TableHeader = React.forwardRef<
   HTMLTableSectionElement,
   TableHeaderInterface
>(({ children, className, ...props }, ref) => {
   return (
      <thead className={cn('w-full', className)} ref={ref} {...props}>
         {children}
      </thead>
   );
});

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowInterface>(
   ({ row, ...props }, ref) => {
      return (
         <tr ref={ref} {...props}>
            {row.map((el) => (
               <th
                  className={el?.cls ? el?.cls : classes['th']}
                  key={el?.heading}
               >
                  {el.heading}
               </th>
            ))}
         </tr>
      );
   },
);

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyInterface>(
   ({ children, ...props }, ref) => {
      return (
         <tbody ref={ref} {...props}>
            {children}
         </tbody>
      );
   },
);

const NextAndPrevButtons = ({
   nextAndPrev,
   disablePrevbtn,
   disableNextbtn,
   prevHandler,
   nextHandler,
}: Props) => {
   return (
      <React.Fragment>
         {!!nextAndPrev ? (
            <div className="_next_prev_buttons_div mt-5 flex justify-end space-x-2">
               <Button
                  className={
                     !disablePrevbtn
                        ? `${classes['_btn']}`
                        : `${classes['_btn']} ${classes['disable_btn']}`
                  }
                  onClick={!disablePrevbtn ? undefined : prevHandler}
               >
                  <NavigateBeforeIcon className="text-gray-500" />
                  <p className="text-sm ms-2 text-gray-800">Prev</p>
               </Button>
               <Button
                  className={
                     !disableNextbtn
                        ? `${classes['_btn']}`
                        : `${classes['_btn']} ${classes['disable_btn']}`
                  }
                  onClick={!disableNextbtn ? undefined : nextHandler}
               >
                  <p className="text-sm me-2 text-gray-800">Next</p>
                  <NavigateNextIcon className="text-gray-500" />
               </Button>
            </div>
         ) : null}
      </React.Fragment>
   );
};

TableContainer.displayName = 'Table Container';
TableChildContainer.displayName = 'Table Child Container';
Table.displayName = 'Table';
TableHeader.displayName = 'Table Header';
TableRow.displayName = 'Table Row';
TableBody.displayName = 'Table Body';
NextAndPrevButtons.displayName = 'Next And Prev Buttons';

export {
   Table,
   TableContainer,
   TableRow,
   TableHeader,
   NextAndPrevButtons,
   TableBody,
   TableChildContainer,
};
