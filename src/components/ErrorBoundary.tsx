import styled from '@emotion/styled';
import React from 'react';
import Color from '@/styles/Color';
import { spacing } from '@/styles/variables';
import Button from './Button';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;

  h1 {
    font-size: 2rem;
    color: ${({ theme }) => theme.color.black};
  }

  p {
    color: ${({ theme }) => theme.color.black};
  }

  button {
    margin-top: ${spacing.m};
    background-color: ${({ theme }) => theme.color.primary};
    border: 1px solid ${({ theme }) => theme.color.primary};

    &:hover,
    &:active {
      background: ${Color('#3772ff').darker(5)};
    }
  }
`;

const BodyBlock = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -100;
`;

const ErrorStackBlock = styled.div`
  width: 100%;
  max-width: 492px;
  margin-top: ${spacing.xl};
  background: ${({ theme }) => theme.color.white};
  font-size: 1.25rem;
  border-radius: 0.5rem;
  box-shadow: 0 8px 24px 0 rgba(153, 156, 178, 0.1);
`;

const ErrorStackContextBox = styled.div`
  overflow-y: auto;
  width: 100%;
  min-height: 200px;
  max-height: 300px;

  ::-webkit-scrollbar {
    width: 10px;
    background-color: ${({ theme }) => theme.color.white};
    border-radius: 0 16px 16px 0;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.color.gray};
    border-radius: 8px;
  }
`;

const ErrorStackText = styled.p`
  padding: ${spacing.l};
  margin: 0;
`;

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    const { children } = this.props;
    const { hasError, error } = this.state;

    if (hasError) {
      // You can render any custom fallback UI
      return (
        <Container>
          <BodyBlock />
          <h1>Something went wrong.</h1>
          <Button onClick={() => window.location.reload()}>Reload</Button>
          {error && process.env.NODE_ENV === 'development' && (
            <ErrorStackBlock>
              <ErrorStackContextBox>
                <ErrorStackText>{error.stack}</ErrorStackText>
              </ErrorStackContextBox>
            </ErrorStackBlock>
          )}
        </Container>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
