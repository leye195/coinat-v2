import styled from '@emotion/styled';
import { flex } from '@/styles/mixin';
import Header from '@/components/Table/Header';
import Row from '@/components/Table/Row';
import Cell from '@/components/Table/Cell';
import Skeleton from '@/components/Table/Skeleton';

type Props = {
  header: JSX.Element | React.ReactElement;
  body: JSX.Element | React.ReactElement;
};

const TableHeaderBox = styled.div`
  ${flex({})}
  border-bottom: 1px solid ${({ theme }) => theme.color.gray};

  div {
    width: 30%;
  }
`;

const TableBodyBox = styled.div``;

const TableContainer = styled.div``;

const Table = ({ header, body }: Props) => {
  return (
    <TableContainer>
      <TableHeaderBox>{header}</TableHeaderBox>
      <TableBodyBox>{body}</TableBodyBox>
    </TableContainer>
  );
};

Table.Header = Header;
Table.Row = Row;
Table.Cell = Cell;
Table.Skeleton = Skeleton;

export default Table;
