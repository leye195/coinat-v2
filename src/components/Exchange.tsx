import styled from '@emotion/styled';
import { breakpoint, flex } from '@/styles/mixin';
import { spacing } from '@/styles/variables';
import Skeleton from '@/components/Skeleton';

type Props = {
  title: string;
  value: string | number;
  isLoading: boolean;
};

const ExchangeBlock = styled.div`
  ${flex({ direction: 'column' })};
  gap: ${spacing.xxs};
  width: 25%;
  padding: ${spacing.s};
  border: 1px solid ${({ theme }) => theme.color.gray};
  border-radius: 16px;
  background-color: white;
  color: ${({ theme }) => theme.color.white};

  ${breakpoint('md').down`
    padding: ${spacing.xs};
  `}
`;

const ExchangeTitle = styled.h6`
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  color: #333333;

  ${breakpoint('md').down`
    width: min-content;
    font-size: 12px;
  `}
`;

const ExchangeValue = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.black};

  ${breakpoint('md').down`
    font-size: 10px;
  `};
`;

const Exchange = ({ title, value, isLoading }: Props) => {
  return (
    <ExchangeBlock>
      <ExchangeTitle>{title}</ExchangeTitle>
      {isLoading ? (
        <Skeleton width="100%" height={18} borderRadius="4px" />
      ) : (
        <ExchangeValue>{value}</ExchangeValue>
      )}
    </ExchangeBlock>
  );
};

export default Exchange;
