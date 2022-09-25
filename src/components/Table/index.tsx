import styled from '@emotion/styled';
import type { ComponentProps } from 'react';
import { flex } from '@/styles/mixin';
import Header from './Header';
import Row from './Row';

type Props = {
  header: string[];
} & ComponentProps<'div'>;

const TableHeaderBox = styled.div`
  ${flex({})}
  border-bottom: 1px solid ${({ theme }) => theme.color.gray};

  div {
    width: 30%;
  }
`;

const TableBodyBox = styled.div``;

const TableContainer = styled.div``;

const Table = ({ children, header }: Props) => {
  return (
    <TableContainer>
      <TableHeaderBox>
        {header.map((item) => (
          <Header name={item} key={item} />
        ))}
      </TableHeaderBox>
      <TableBodyBox>{children}</TableBodyBox>
    </TableContainer>
  );
};

Table.Header = Header;
Table.Row = Row;

export default Table;
