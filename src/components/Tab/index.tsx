import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { typeState } from 'store/coin';
import TabButton from './Button';
import TabGroup from './Group';

type Props = {
  tabs: string[];
};

const Tab = ({ tabs }: Props) => {
  const [coinType, setCoinType] = useRecoilState(typeState);
  const router = useRouter();

  const handleClick = (name: string) => () => {
    router.push(`?type=${name}`);
  };

  useEffect(() => {
    const path = router.asPath;

    if (path === '/?type=BTC') {
      setCoinType('BTC');
    } else {
      setCoinType('KRW');
    }
  }, [router, setCoinType]);

  return (
    <TabGroup>
      {tabs.map((tab) => (
        <TabButton
          key={tab}
          isActive={tab === coinType}
          onClick={handleClick(tab)}
        >
          {tab}
        </TabButton>
      ))}
    </TabGroup>
  );
};

Tab.Group = TabGroup;

export default Tab;
