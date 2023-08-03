'use client';

import React from 'react';
import { useParams } from 'next/navigation';

function LotteryPage() {
   const params = useParams();
   console.log(params);
   return <div>LotteryPage</div>;
}

export default LotteryPage;
