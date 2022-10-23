import styled from '@emotion/styled';
import { flex } from '@/styles/mixin';

type Props = {
  nickname: string;
  message: string;
};

const Container = styled.div`
  ${flex({ alignItems: 'center' })};
`;

const NickName = styled.span`
  font-weight: 600;
`;

const Text = styled.p`
  margin: 0;
  font-weight: 400;
`;

const Item = ({ message, nickname }: Props) => {
  return (
    <Container>
      <Text>
        <NickName>{nickname}:</NickName> {message}
      </Text>
    </Container>
  );
};

export default Item;
