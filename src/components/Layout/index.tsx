import styled from '@emotion/styled';
import Header from '@/components/Layout/Header';
import { breakpoint } from '@/styles/mixin';
import { spacing } from '@/styles/variables';

type Props = {
  children?: React.ReactNode;
  headerColor?: string;
  isHideHeader?: boolean;
};

const MainContainer = styled.main`
  min-height: calc(100vh - ${({ theme }) => theme.rem(48)});
  position: relative;
`;

const MainBox = styled.div`
  max-width: 1410px;
  height: 100%;
  margin: 0 auto;
  padding: 0 ${spacing.s} ${spacing.m};

  ${breakpoint('md').down`
    padding: 0 0.5rem;
  `}

  ${breakpoint('sm').down`
    padding: 0 0.125rem;
  `}
`;

const Layout = ({ children, headerColor, isHideHeader }: Props) => {
  return (
    <>
      {!isHideHeader && <Header headerColor={headerColor} />}
      <MainContainer>
        <MainBox>{children}</MainBox>
      </MainContainer>
    </>
  );
};

export default Layout;
