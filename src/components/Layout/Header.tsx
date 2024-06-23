import styled from '@emotion/styled';
import Image from 'next/image';
import Link from 'next/link';
import { Text } from '@/components/Text';
import usePrefetch from '@/hooks/usePrefetch';
import { breakpoint, flex } from '@/styles/mixin';
import { palette } from '@/styles/variables';
import { getMarketcap } from 'api';

type Props = {
  headerColor?: string;
};

const Container = styled.header<{ color?: string }>`
  ${flex({ alignItems: 'center', justifyContents: 'space-between' })};
  width: 100%;
  height: 3rem;
  background-color: ${({ color }) => color ?? '#000000cc'};

  ${breakpoint('md').down`
    height: 2.25rem;
  `}
`;

const Nav = styled.nav`
  ${flex({ alignItems: 'center', justifyContents: 'space-between' })};
  max-width: 1410px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0.75rem;
`;

const Logo = styled.div`
  position: relative;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.5rem;

  ${breakpoint('md').down`
    font-size: 1rem;
  `}
`;

const Header = ({ headerColor }: Props) => {
  usePrefetch({
    queryKey: ['marketcap'],
    queryFn: getMarketcap,
  });

  return (
    <Container color={headerColor}>
      <Nav>
        <div>
          <Link href="/">
            <Logo>
              CoinAT
              <Image
                className="absolute translate-x-[5rem] translate-y-[-2rem]"
                src="/assets/icons/coin.svg"
                alt="coin"
                width={14}
                height={14}
              />
            </Logo>
          </Link>
        </div>
        <div>
          <Link href="/trend">
            <Text fontSize="14px" color={palette.white}>
              코인동향
            </Text>
          </Link>
        </div>
      </Nav>
    </Container>
  );
};

export default Header;
