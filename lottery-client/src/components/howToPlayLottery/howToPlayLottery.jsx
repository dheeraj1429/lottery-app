import React, { Fragment } from 'react';
import classes from './howToPlayLottery.module.css';
import Image from 'next/image';

const Card = function ({ heading, subHeading, src }) {
   return (
      <div className={classes['item_card']}>
         <div className={`${classes['img_div']} flex justify-center`}>
            <Image src={src} alt="Gift images" width={120} height={120} />
         </div>
         <div className="text-center mt-2">
            <h5 className="text-gray-100 text-xl font-bold">{heading}</h5>
            <p className="text-gray-500 text-sm mt-2">{subHeading}</p>
         </div>
      </div>
   );
};

function HowToPlayLottery() {
   return (
      <Fragment>
         <h5 className="text-gray-300 text-lg md:text-2xl font-bold mt-4">
            How To Play
         </h5>
         <div className={classes['main_div']}>
            <div className="lg:flex block items-center justify-center space-x-0 lg:space-x-2">
               <Card
                  heading={'Buy Tickets'}
                  subHeading={
                     'Buy a ticket for $0.1 and choose numbers for the ticket.'
                  }
                  src={'/images/ticket-discount.png'}
               />
               <Card
                  heading={'Wait For the Draw'}
                  subHeading={'Wait for the draw at 15:00 UTC+0 every day.'}
                  src={'/images/timer.png'}
               />
               <Card
                  heading={'Check the Price'}
                  subHeading={`Once the draw is over, come back to this page
and check your prize.`}
                  src={'/images/saint-patrick-gifts.png'}
               />
            </div>
         </div>
      </Fragment>
   );
}

export default HowToPlayLottery;
