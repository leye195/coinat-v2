import styled from '@emotion/styled';
import { flex } from '@/styles/mixin';

type Props = {
  message: string;
};

const Container = styled.div`
  ${flex({ alignItems: 'center' })};
`;

const Text = styled.p``;

const Item = ({ message }: Props) => {
  return (
    <Container>
      <Text>{message}</Text>
    </Container>
  );
};

export default Item;
