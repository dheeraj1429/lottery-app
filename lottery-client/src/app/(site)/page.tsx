import LotteryBanner from '@/components/lotteryBanner/lotteryBanner';
import HowToPlayLottery from '@/components/howToPlayLottery/howToPlayLottery';
import LotteryRules from '@/components/lotteryRules/lotteryRules';
import LotteryTabs from '@/components/lotteryTabs/lotteryTabs';

export default function Home({
   params,
   searchParams,
}: {
   params: { slug: string };
   searchParams?: { clientId: string | undefined; userId: string | undefined };
}) {
   return (
      <div className="p-4">
         <LotteryBanner />
         <LotteryTabs />
         <HowToPlayLottery />
         <LotteryRules />
      </div>
   );
}