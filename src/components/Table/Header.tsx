import { spacing } from '@/styles/variables';
import styled from '@emotion/styled';

type Props = {
  name: string;
  width?: string;
};

const HeaderBlock = styled.div<{ width?: string }>`
  padding: ${spacing.xs};
`;

const Header = ({ name, width }: Props) => {
  return <HeaderBlock width={width}>{name}</HeaderBlock>;
};

export default Header;
