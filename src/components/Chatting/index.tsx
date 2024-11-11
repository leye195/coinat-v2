import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import {
  faChevronDown,
  faPaperPlane,
  faCommentDots,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { postChat } from '@/api';
import Button from '@/components/Button';
import Form from '@/components/Form';
import Input from '@/components/Input';
import { chatSocketState } from '@/store/socket';
import { breakpoint, flex } from '@/styles/mixin';
import { spacing } from '@/styles/variables';
import Item from './Item';
import List from './List';

type FormState = {
  message: string;
};

const Container = styled.div`
  position: fixed;
  right: 1rem;
  bottom: 1.5rem;

  ${breakpoint('xl').down`
    left: 0;
    right: 0;
    bottom: 0;
    top: auto;
  `};
`;

const ChatIconContainer = styled(Container)`
  right: 1rem;
  bottom: 1.5rem;

  ${breakpoint('xl').down`
    left: auto;
    bottom: 1.5rem;
    right: 1rem;
  `};
`;

const ChatIconWrapper = styled(Button)`
  padding: ${spacing.xs};
  border: none;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  box-shadow: -2px 3px 3px 1px #bebebe;
`;

const ChatWrapper = styled.div`
  border: 1px solid #e3e3e3;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.color.white};

  ${breakpoint('lg').down`
    border-radius: 0;
  `};
`;

const ChatHeaderLogo = styled(Button)`
  ${flex({ alignItems: 'center' })}
  gap: ${spacing.xs};
  padding: 0;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.color.white};
  font-weight: 800;
  cursor: pointer;
`;

const ChatHeader = styled.div`
  padding: ${spacing.s};
  background-color: #000c;
  font-size: 24px;
`;

const ChatContents = styled.div`
  padding: 0;
`;

const ChatFooter = styled.div`
  padding: ${spacing.s} ${spacing.xs} ${spacing.s} ${spacing.xs};
  background-color: #000c;

  button {
    border: none;
    background-color: transparent;
    color: white;
    cursor: pointer;

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
  flex: 1;
  padding: ${spacing.s} ${spacing.xs};
  border: 1px solid #e3e3e3;
  border-radius: 8px;
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
