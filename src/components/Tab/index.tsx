import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { typeState } from 'store/coin';
import { flex } from '@/styles/mixin';

import TabButton from './Button';
import TabGroup from './Group';

const ActiveBar = styled.div<{ left: string }>`
  ${flex({ alignItems: 'center', justifyContents: 'center' })};
  position: absolute;
  left: ${({ left }) => left};
  bottom: 0;
  transition: all 200ms 30ms cubic-bezier(0.4, 0, 0.6, 1);
  background-color: #f8b64c;
  color: white;
  height: 3px;
  width: 50%;
  z-index: 0;
`;

type Props = {
  tabs: string[];
};

const Tab = ({ tabs }: Props) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [coinType, setCoinType] = useRecoilState(typeState);
  const router = useRouter();

  const handleClick = (name: string, idx: number) => () => {
    setActiveIdx(idx);
    router.push(`?type=${name}`);
  };

  useEffect(() => {
    const path = router.asPath;

    if (path === '/?type=BTC') {
      setCoinType('BTC');
      setActiveIdx(1);
    } else {
      setCoinType('KRW');
      setActiveIdx(0);
    }
  }, [router, setCoinType]);

  return (
    <TabGroup>
      {tabs.map((tab, idx) => (
        <TabButton
          key={tab}
          isActive={tab === coinType}
          onClick={handleClick(tab, idx)}
        >
          {tab}
        </TabButton>
      ))}
      <ActiveBar left={`${(100 / tabs.length) * activeIdx}%`} />
    </TabGroup>
  );
};

Tab.Button = TabButton;
Tab.Group = TabGroup;

export default Tab;
