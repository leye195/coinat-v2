import { css } from "@emotion/react";
import type { NextPage } from "next";

const Container = css`
  font-weight: 700;
`;

const Home: NextPage = () => {
  return <div css={Container}>Main Page</div>;
};

export default Home;
