import { Suspense } from 'react';
import Tab from '@/components/Tab';
import { cn } from '@/lib/utils';
import Contents from './components/Contents';

export default async function MainPage() {
  return (
    <section className="pb-8 max-xl:pb-[5.25rem]">
      <div className={cn('mx-auto my-0 max-w-[768px]', 'max-md:mt-1')}>
        <Suspense>
          <Tab tabs={['KRW', 'BTC']} />
        </Suspense>
        <Contents />
      </div>
    </section>
  );
}
