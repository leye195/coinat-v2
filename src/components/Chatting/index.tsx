import styled from '@emotion/styled';
import {
  faChevronDown,
  faPaperPlane,
  faCommentDots,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import Button from '@/components/Button';
import Form from '@/components/Form';
import Input from '@/components/Input';
import { breakpoint, flex } from '@/styles/mixin';
import { spacing } from '@/styles/variables';
import { postChat } from 'api';
import { chatSocketState } from 'store/socket';
import Item from './Item';
import List from './List';

type FormState = {
  message: string;
};

const Container = styled.div`
  position: fixed;
  bottom: 1.5rem;
  right: 1rem;

  ${breakpoint('xl').down`
    left: 0;
    right: 0;
    bottom: 0;
    top: auto;
  `};
`;

const ChatIconContainer = styled(Container)`
  bottom: 1.5rem;
  right: 1rem;

  ${breakpoint('xl').down`
    left: auto;
    bottom: 1.5rem;
    right: 1rem;
  `};
`;

const ChatIconWrapper = styled(Button)`
  padding: ${spacing.xs};
  border-radius: 8px;
  box-shadow: -2px 3px 3px 1px #bebebe;
  background-color: white;
  border: none;
  cursor: pointer;
`;

const ChatWrapper = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  border-radius: 8px;
  border: 1px solid #e3e3e3;
  overflow: hidden;

  ${breakpoint('lg').down`
    border-radius: 0;
  `};
`;

const ChatHeaderLogo = styled(Button)`
  ${flex({ alignItems: 'center' })}
  gap: ${spacing.xs};
  padding: 0;
  background-color: transparent;
  color: ${({ theme }) => theme.color.white};
  border: none;
  font-weight: 800;
  cursor: pointer;
`;

const ChatHeader = styled.div`
  padding: ${spacing.s};
  font-size: 24px;
  background-color: #000000cc;
`;

const ChatContents = styled.div`
  padding: 0;
`;

const ChatFooter = styled.div`
  padding: ${spacing.s} ${spacing.xs} ${spacing.s} ${spacing.xs};
  background-color: #000000cc;

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: white;

    &:disabled {
      color: #b2b2b2;
      cursor: not-allowed;
    }
  }
`;

const ChatForm = styled(Form)`
  ${flex({ alignItems: 'center' })}
  gap: ${spacing.xs};
  width: 100%;
`;

const ChatInput = styled(Input)`
  padding: ${spacing.s} ${spacing.xs};
  flex: 1;
  border-radius: 8px;
  border: 1px solid #e3e3e3;
`;

const Chatting = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [chat, setChat] = useState<string[]>([]);

  const socketDataState = useRecoilValue(chatSocketState);

  const { register, watch, handleSubmit, resetField } = useForm<FormState>({
    mode: 'onChange',
  });

  const { message } = watch();

  const handleOpen = (isOpen: boolean) => () => {
    setIsOpened(isOpen);
  };

  const onSubmit = async (data: FormState) => {
    try {
      await postChat(data.message);
      resetField('message');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const { socket, isConnected } = socketDataState;

    if (isConnected && socket) {
      socket?.on('message', (data: any) => {
        const { message } = data;
        setChat((prev) => [...prev, message]);
      });
    }
  }, [socketDataState]);

  if (!isOpened) {
    return (
      <ChatIconContainer>
        <ChatIconWrapper onClick={handleOpen(true)}>
          <FontAwesomeIcon icon={faCommentDots} size="2x" />
        </ChatIconWrapper>
      </ChatIconContainer>
    );
  }

  return (
    <Container>
      <ChatWrapper>
        <ChatHeader>
          <ChatHeaderLogo onClick={handleOpen(false)}>
            CHAT
            <FontAwesomeIcon icon={faChevronDown} size="xs" />
          </ChatHeaderLogo>
        </ChatHeader>
        <ChatContents>
          <List>
            {chat.map((message, idx) => (
              <Item key={`chat-${idx}`} message={message} nickname="nickName" />
            ))}
          </List>
        </ChatContents>
        <ChatFooter>
          <ChatForm onSubmit={handleSubmit(onSubmit)}>
            <ChatInput {...register('message', { required: true })} />
            <Button type="submit" disabled={!message}>
              <FontAwesomeIcon icon={faPaperPlane} size="lg" />
            </Button>
          </ChatForm>
        </ChatFooter>
      </ChatWrapper>
    </Container>
  );
};

export default Chatting;
