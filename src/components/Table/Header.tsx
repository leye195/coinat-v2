import styled from '@emotion/styled';
import { breakpoint, flex } from '@/styles/mixin';
import { spacing } from '@/styles/variables';

type Props = {
  name: React.ReactNode;
  width?: string;
  right?: JSX.Element | React.ReactNode;
  onClick?: () => void;
};

const HeaderBlock = styled.div<{ width?: string }>`
  ${flex({ alignItems: 'center' })}
  width: ${({ width }) => width ?? '25%'};
  padding: ${spacing.s} ${spacing.xs};
  font-weight: 400;
  cursor: pointer;

  ${breakpoint('lg').down`
    font-size: 14px;
  `}

  ${breakpoint('md').down`
    font-size: 12px;
  `}

  ${breakpoint('sm').down`
    font-size: 10px;
  `}
`;

const RightBox = styled.div`
  ${flex({})}
  margin-left: ${spacing.s};

  ${breakpoint('md').down`
    margin-left: ${spacing.xs};
  `}

  ${breakpoint('sm').down`
    margin-left: ${spacing.xxs};
  `}
`;

const Header = ({ name, width, right, onClick }: Props) => {
  return (
    <HeaderBlock width={width} onClick={onClick}>
      {name}
      {right && <RightBox>{right}</RightBox>}
    </HeaderBlock>
  );
};

export default Header;
