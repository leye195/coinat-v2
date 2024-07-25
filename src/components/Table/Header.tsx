import styled from '@emotion/styled';
import { cn } from '@/lib/utils';
import { breakpoint, flex } from '@/styles/mixin';
import { spacing } from '@/styles/variables';

type Props = {
  name: React.ReactNode;
  width?: string;
  right?: JSX.Element | React.ReactNode;
  onClick?: () => void;
};

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
    <div
      className={cn(
        'flex items-center cursor-pointer',
        'px-2 py-3 font-normal w-[var(--width)]',
        'max-lg:text-[14px] max-md:text-[12px] max-sm:text-[10px]',
      )}
      style={{
        '--width': width ?? '25%',
      }}
      onClick={onClick}
    >
      {name}
      {right && <RightBox>{right}</RightBox>}
    </div>
  );
};

export default Header;
