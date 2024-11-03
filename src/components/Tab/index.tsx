import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useId, useMemo } from 'react';

import { flex } from '@/styles/mixin';
import TabButton from './Button';
import TabGroup from './Group';

export const ActiveBar = styled.div<{ left: string; width: string }>`
  position: absolute;
  z-index: 0;
  bottom: 0;
  left: ${({ left }) => left};
  width: ${({ width }) => width};
  height: 3px;
  background-color: #f8b64c;
  color: white;
  transition: all 200ms 30ms cubic-bezier(0.4, 0, 0.6, 1);

  ${flex({ alignItems: 'center', justifyContents: 'center' })};
`;

type TabProps = {
  tabs: string[];
};

const Tab = ({ tabs }: TabProps) => {
  const id = useId();
  const router = useRouter();
  const { type } = router.query;

  const activeIdx = useMemo(() => {
    const index = tabs.findIndex((tab) => tab === type);
    return index !== -1 ? index : 0;
  }, [tabs, type]);

  const tabWidth = useMemo(() => `${100 / tabs.length}%`, [tabs.length]);
  const activeBarLeft = useMemo(
    () => `${(100 / tabs.length) * activeIdx}%`,
    [tabs.length, activeIdx],
  );

  const handleClick = (name: string, idx: number) => () => {
    router.push(`?type=${name}`);
  };

  return (
    <TabGroup key={id}>
      {tabs.map((tab, idx) => (
        <TabButton
          key={tab}
          isActive={idx === activeIdx}
          onClick={handleClick(tab, idx)}
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
