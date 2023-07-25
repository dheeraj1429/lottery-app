import classes from './layout.module.css';

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <div className={classes['container']}>
         <div className={classes['overlay_div']} />
         <div className={classes['main_div']}>{children}</div>
      </div>
   );
}
