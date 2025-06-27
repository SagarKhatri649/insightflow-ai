import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

export default function UploadHeader() {
  return (
    <div className='flex flex-col items-center justify-center gap-6 text-center'>
      <div className='relative p-[1px] overflow-hidden rounded-full bg-linear-to-r from-rose-200 via-rose-500 to-rose-800 animate-gradient-x group'>
        <Badge
          variant={'secondary'} className="flex items-center px-6 py-2 bg-white text-black rounded-full transition-colors duration-200 group-hover:bg-rose-100">

          <Sparkles className="h-6 w-6 mr-2 text-rose-600 animate-pulse" />

          <span className="text-base text-black">AI-Powered Content Creation</span>

        </Badge>

      </div>
      <div className='capitalise text-3xl font-bold tracking-tight text-white sm:text-4xl'>
        Start Uploading{' '}
        <span className='relative inline-block'>
          <span className=' relative z-10 px-2 '> Your YouTube Video link
          </span>
          <span className='absolute inset-0 bg-rose-200/50 -rotate-2 rounded-lg transform -skew-y-1'
            aria-hidden='true'>
          </span>
        </span>{' '}
      </div>
      <div className='mt-2 text-lg leading-8 text-gray-100 max-w-2xl text-center'>
        <p> Drop youtube link here
        </p>
      </div>
    </div>

  );
}