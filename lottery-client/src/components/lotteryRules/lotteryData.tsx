import { AiFillStar } from '@react-icons/all-files/ai/AiFillStar';
import { HiOutlineTicket } from '@react-icons/all-files/hi/HiOutlineTicket';
import LotteryTicketBalls from '../lotteryTicketBalls/lotteryTicketBalls';

export const Row = [
   {
      heading: (
         <div className="flex items-center space-x-2">
            <AiFillStar className="text-green-600 text-xl" />
            <p className="text-green-600 text-sm font-semibold">
               5 Numbers Jacpot Ball
            </p>
         </div>
      ),
      balls: <LotteryTicketBalls show={[1, 2, 3, 4, 5, 6]} isDemo={true} />,
      price: (
         <div className="flex items-center justify-end space-x-2">
            <p className="text-green-600 text-sm font-semibold">$100,000.00</p>
            <AiFillStar className="text-green-600 text-xl" />
         </div>
      ),
      id: 110,
   },
   {
      heading: <p className="text-gray-200">4 numbers</p>,
      balls: <LotteryTicketBalls show={[1, 2, 3, 4]} isDemo={true} />,
      price: <p className="text-gray-200">$20.00</p>,
      id: 111,
   },
   {
      heading: <p className="text-gray-200">3 numbers</p>,
      balls: <LotteryTicketBalls show={[1, 2, 3]} isDemo={true} />,
      price: <p className="text-gray-200">$1.00</p>,
      id: 112,
   },
   {
      heading: <p className="text-gray-200">No numbers</p>,
      balls: <LotteryTicketBalls show={[]} isDemo={true} />,
      price: (
         <div className="flex items-center justify-end space-x-3">
            <HiOutlineTicket className="text-green-500" />
            <p className="text-gray-200">+1 ticket</p>
         </div>
      ),
      id: 113,
   },
];
