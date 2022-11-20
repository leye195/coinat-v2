import styled from '@emotion/styled';
import Image from 'next/future/image';
import { breakpoint, flex } from '@/styles/mixin';

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

  img {
    position: absolute;
  }
`;

const LeftSide = styled.div``;

const RightSide = styled.div``;

const Header = ({ headerColor }: Props) => {
  return (
    <Container color={headerColor}>
      <Nav>
        <LeftSide>
          <Logo>
            CoinAT
            <Image src="/assets/coin.svg" alt="coin" width={14} height={14} />
          </Logo>
        </LeftSide>
        <RightSide></RightSide>
      </Nav>
    </Container>
  );
};

export default Header;
