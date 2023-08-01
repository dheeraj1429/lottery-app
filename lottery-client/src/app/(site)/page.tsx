import LotteryBanner from '@/components/lotteryBanner/lotteryBanner';
import HowToPlayLottery from '@/components/howToPlayLottery/howToPlayLottery';
import LotteryRules from '@/components/lotteryRules/lotteryRules';
import LotteryTabs from '@/components/lotteryTabs/lotteryTabs';
import { SearchParams } from '.';
import { InterigationApiResponse } from '@/types/interface';

const checkInterigation = async function (
   data: SearchParams,
): Promise<InterigationApiResponse> {
   const { clientId, userId } = data;

   const userInfo = await fetch(
      `${process.env.NEXT_APP_BACKEND_URL}/client/integration?clientId=${clientId}&userId=${userId}`,
      {
         cache: 'no-cache',
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
         },
      },
   );

   return await userInfo.json();
};

export default async function Home({
   searchParams,
}: {
   params: { slug: string };
   searchParams?: SearchParams;
}) {
   if (!searchParams?.clientId || !searchParams?.userId) {
      throw new Error(
         `${
            (!searchParams?.clientId && 'Client id') ||
            (!searchParams?.userId && 'User id')
         } is required`,
      );
   }

   const interigation = await checkInterigation(searchParams);

   if (!interigation?.success) {
      throw new Error(`${interigation?.message}`);
   }

   return (
      <div className="p-4">
         <LotteryBanner />
         <LotteryTabs />
         <HowToPlayLottery />
         <LotteryRules data={interigation} />
      </div>
   );
}
