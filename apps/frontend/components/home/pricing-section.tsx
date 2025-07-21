// import Link from 'next/link';
// import { cn } from '@/lib/utils'
// import { ArrowRight, CheckIcon } from 'lucide-react';

// type PriceType = {
//   name: string;
//   price: number;
//   description: string;
//   items: string[];
//   id: string;
//   paymentLink: string;
//   priceId: string;
// };
// const plans = [
//   {
//     name: 'Basic',
//     price: 2,
//     description: 'Perfect for occasional use',
//     items: [

//       'processing minutes',
//       'YouTube processing',
//       'Video timestamps',
//     ],
//     id: 'basic',
//     paymentLink: ' ',
//     priceId: ' ',

//   },
//   {
//     name: 'Pro',
//     price: 10,
//     description: '  for Professional Use use',
//     items: [
//       'processing minutes',
//       'YouTube processing',
//       'Chat with your video',
//       'SEO Tool',
//       ' Prompts workspace',
//       'Video timestamps',
//     ],
//     id: 'pro',
//     paymentLink: ' ',
//     priceId: ' ',
//   },
// ];
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowRight, CheckIcon } from 'lucide-react';

type PriceType = {
  name: string;
  price: number;
  description: string;
  items: string[];
  id: string;
  paymentLink: string;
};

const plans: PriceType[] = [
  {
    name: 'Basic',
    price: 2,
    description: 'Perfect for occasional use',
    items: ['Processing minutes', 'YouTube processing', 'Video timestamps'],
    id: 'basic',
    paymentLink: '/checkout/basic',
  },
  {
    name: 'Pro',
    price: 10,
    description: 'For power users and teams',
    items: [
      'Unlimited minutes',
      'YouTube processing',
      'Chat with your video',
      'SEO tools',
      'Prompts workspace',
      'Timestamps & chapters',
    ],
    id: 'pro',
    paymentLink: '/checkout/pro',
  },
];
function PricingCard({ name, price, description, items, id, paymentLink }: PriceType) {
  const isPro = id === 'pro';
  return (
    <div
      className={cn(
        'w-full max-w-md p-8 rounded-2xl shadow-xl transform transition hover:-translate-y-2',
        isPro ? 'bg-gray-800 border-2 border-teal-500' : 'bg-gray-700 border border-gray-600'
      )}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white capitalize">{name}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>

      <div className="flex items-baseline mb-6">
        <span className="text-5xl font-extrabold text-white">${price}</span>
        <span className="ml-2 text-sm text-gray-400 uppercase">USD /mo</span>
      </div>

      <ul className="space-y-3 mb-6">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center text-gray-200">
            <CheckIcon className="w-5 h-5 text-teal-400 mr-2 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <Link href={paymentLink}

        className={cn(
          'block w-full text-center py-3 rounded-full font-semibold text-white transition transform hover:scale-105',
          isPro
            ? 'bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400'
            : 'bg-teal-500 hover:bg-teal-600'
        )}
      >
        Buy Now <ArrowRight className="inline-block w-4 h-4 ml-2" />

      </Link>
    </div>
  );
}
// const PricingCard = ({
//   name,
//   price,
//   description,
//   items,
//   id,
//   paymentLink,
// }: PriceType) => {
//   return (
//     <div className="relative w-full max-w-lg hover:scale-105 hover:transition-all duration-300">
//       <div className={cn(
//         'relative flex flex-col h-full gap-4 lg:gap-8 z-10 p-8 border-[1px] border-gray-200/50 rounded-2xl',
//         id === 'pro' && 'border-rose-500 gap-5 border-2'
//       )} >

//         <div className='flex justify-between items-center gap-4'>
//           <p className='text-lg lg:text-xl font-bold capitalize'>{name}</p>

//           <p className='text-base-content/80 mt-2'>{description}</p>
//         </div>

//         <div className='flex gap-2'>
//           <p className='text-5xl tracking-tight font-extrabold'>$
//             {price}</p>
//           <div className='flex flex-col justify-end mb-[4px]'>
//             <p className='text-xs uppercase font-semibold '>USD</p>
//             <p className='text-xs'>/Month</p>
//           </div>
//         </div>


//         <div className='space-y-2.5 leading-relaxed text-base flex-1'>
//           {items.map((item, idx) => (
//             <li key={idx} className='flex items-center gap-2'>
//               <CheckIcon size={18} />
//               <span>{item}</span>
//             </li>
//           ))}
//         </div>

//         <div className='space-y-2 flex justify-center w-full'>
//           <Link
//             href={paymentLink}
//             className={cn(
//               "w-full rounded-full flex items-center justify-center gap-2 bg-linear-to-r from-rose-800 to-rose-500 hover:from-rose-500 hover:to-rose-800 text-white border-2 py-2",
//               id === 'pro'
//                 ? 'border-rose-900'
//                 : 'border-rose-100 from-rose-400 to-rose-500'
//             )}
//           > BUY NOW <ArrowRight size={18} /></Link>
//         </div>
//       </div>
//     </div>
//   );
// };
export default function PricingSection() {
  return (
    <section
      id="Pricing"
      className="pt-24 pb-32 bg-gradient-to-b from-black via-gray-900 to-black"
    >
      <div className="container mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-teal-400 uppercase tracking-wide font-bold mb-4">Pricing</h2>
        <p className="max-w-2xl mx-auto text-xl text-gray-300 mb-12">
          Choose the plan that fits your needs. Scale from occasional to pro-level usage.
        </p>
        <div className="flex flex-col lg:flex-row gap-8 justify-center">
          {plans.map((plan) => (
            <PricingCard key={plan.id} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
// export default function PricingSection() {
//   return (
//     <section className="relative overflow-hidden"
//       id="Pricing">
//       <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
//         <div className='flex items-center justify-center w-full pb-12'>
//           <h2 className='uppercase font-bold text-xl mb-8 text-rose-500'> Pricing</h2>
//         </div>
//         <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
//           {plans.map((plan) => (
//             <PricingCard key={plan.id} {...plan} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };