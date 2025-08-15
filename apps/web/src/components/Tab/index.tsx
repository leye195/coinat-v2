'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useId, useMemo } from 'react';
import { cn } from '@/lib/utils';
import TabButton from './Button';
import TabGroup from './Group';

type ActiveBarProps = {
  left: string;
  width: string;
};

export const ActiveBar = ({ left, width }: ActiveBarProps) => (
  <div
    className={cn(
      'absolute z-0 bottom-0 h-[3px] text-white bg-[#f8b64c]',
      'flex items-center justify-center',
      'left-[var(--left)] w-[var(--width)]',
      'transition-all duration-200 delay-30 ease-[cubic-bezier(0.4,0,0.6,1)]',
    )}
    style={{
      '--left': left,
      '--width': width,
    }}
  />
);

type TabProps = {
  tabs: string[];
};

const Tab = ({ tabs }: TabProps) => {
  const id = useId();
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams?.get('type');

  const activeIdx = useMemo(() => {
    const index = tabs.findIndex((tab) => tab === type);
    return index !== -1 ? index : 0;
  }, [tabs, type]);

  const tabWidth = useMemo(() => `${100 / tabs.length}%`, [tabs.length]);
  const activeBarLeft = useMemo(
    () => `${(100 / tabs.length) * activeIdx}%`,
    [tabs.length, activeIdx],
  );

  const handleClick = (name: string) => () => {
    router.push(`?type=${name}`);
  };

  return (
    <TabGroup key={id}>
      {tabs.map((tab, idx) => (
        <TabButton
          key={tab}
          isActive={idx === activeIdx}
          onClick={handleClick(tab)}
        >
          {tab}
        </TabButton>
      ))}
      <ActiveBar left={activeBarLeft} width={tabWidth} />
    </TabGroup>
  );
};

Tab.Button = TabButton;
Tab.Group = TabGroup;

export default Tab;
