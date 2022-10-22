import { spacing } from '@/styles/variables';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faPaperPlane,
  faCommentDots,
} from '@fortawesome/free-solid-svg-icons';

import { breakpoint, flex } from '@/styles/mixin';
import { chatSocketState } from 'store/socket';

import Button from '@/components/Button';
import Item from './Item';
import List from './List';

const Container = styled.div`
  position: fixed;
  bottom: 1.5rem;
  right: 1rem;

  ${breakpoint('lg').down`
    left: 0;
    right: 0;
    bottom: 0;
  `};
`;

const ChatIconContainer = styled(Container)`
  left: auto;
  right: 0;
  top: 8rem;
  bottom: auto;

  ${breakpoint('lg').down`
    left: auto;
    right: 0;
    top: 8rem;
    bottom: auto;
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
  ${flex({ alignItems: 'center' })}
  gap: ${spacing.xs};
  padding: ${spacing.s} ${spacing.xs} ${spacing.s} ${spacing.xs};
  background-color: #000000cc;

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: white;
  }
`;

const Input = styled.input`
  padding: ${spacing.s} ${spacing.xs};
  flex: 1;
  border-radius: 8px;
  border: 1px solid #e3e3e3;
`;

const Chatting = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [chat, setChat] = useState<string[]>([]);

  const socketDataState = useRecoilValue(chatSocketState);

  const handleOpen = (isOpen: boolean) => () => {
    setIsOpened(isOpen);
  };

  useEffect(() => {
    const { socket, isConnected } = socketDataState;

    if (isConnected && socket) {
      socket?.on('message', (message: any) => {
        console.log(message);
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
            {chat.map((data) => (
              <Item message={data} />
            ))}
          </List>
        </ChatContents>
        <ChatFooter>
          <Input />
          <Button>
            <FontAwesomeIcon icon={faPaperPlane} size="lg" />
          </Button>
        </ChatFooter>
      </ChatWrapper>
    </Container>
  );
};

export default Chatting;
