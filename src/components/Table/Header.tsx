import { breakpoint } from '@/styles/mixin';
import { spacing } from '@/styles/variables';
import styled from '@emotion/styled';

type Props = {
  name: string;
  width?: string;
};

const HeaderBlock = styled.div<{ width?: string }>`
  padding: ${spacing.xs};

  ${breakpoint('md').down`
    font-size: 12px;
  `}
`;

const Header = ({ name, width }: Props) => {
  return <HeaderBlock width={width}>{name}</HeaderBlock>;
};

export default Header;
