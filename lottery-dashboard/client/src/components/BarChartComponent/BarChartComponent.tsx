import { LotteryNumberItemsInterface } from '@/redux/features/luckyDraw';
import React from 'react';
import {
   BarChart,
   Bar,
   Brush,
   ReferenceLine,
   XAxis,
   YAxis,
   Tooltip,
   Legend,
   ResponsiveContainer,
} from 'recharts';

interface Props {
   data: LotteryNumberItemsInterface[];
   label: string;
   dataKey?: string;
}

function BarChartComponent({ data, label, dataKey }: Props) {
   return (
      <div className="w-full h-full">
         <p className="text-gray-800 font-semibold">{label}</p>
         <ResponsiveContainer width="100%" height={label ? '95%' : '100%'}>
            <BarChart
               width={500}
               height={300}
               data={data}
               margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
               }}
            >
               <XAxis dataKey="name" />
               <YAxis />
               <Tooltip />
               <Legend
                  verticalAlign="top"
                  wrapperStyle={{ lineHeight: '40px' }}
               />
               <ReferenceLine y={0} stroke="#000" />
               <Brush dataKey="name" height={30} stroke="#8884d8" />
               <Bar
                  dataKey={dataKey ? dataKey : 'count'}
                  fill="rgb(252, 141, 1)"
               />
            </BarChart>
         </ResponsiveContainer>
      </div>
   );
}

export default BarChartComponent;
