import { Props } from '.';
import Link from 'next/link';
import classes from './icon.module.css';

function IconList({ heading, icon, link }: Props) {
   return (
      <Link href={link}>
         <div className={classes['main_div']}>
            <div className={classes['icon_div']}>{icon}</div>
            <p className="text-gray-700 text-sm font-medium">{heading}</p>
         </div>
      </Link>
   );
}

export default IconList;
