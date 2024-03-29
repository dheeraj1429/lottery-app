import { Props } from './';

function Error({ data }: Props) {
   return Array.isArray(data) ? (
      <div>
         <div>
            {data.map((el) => (
               <div className="text-center mb-2">
                  <p className="text-sm text-red-500">{el}</p>
               </div>
            ))}
         </div>
      </div>
   ) : (
      <div>
         <p className="text-sm text-red-500">{data}</p>
      </div>
   );
}

export default Error;
