import styled from '@emotion/styled';

const Container = styled.footer`
  width: 100%;
  background-color: #ffffff;
`;

const FooterContent = styled.div`
  max-width: 1410px;
  width: 100%;
  padding: 0.75rem;
`;

const Footer = () => {
  return (
    <Container>
      <FooterContent>Footer</FooterContent>
    </Container>
  );
};

export default Footer;
