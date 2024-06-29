import Cell from '@/components/Table/Cell';
import Header from '@/components/Table/Header';
import Row from '@/components/Table/Row';
import Skeleton from '@/components/Table/Skeleton';

type Props = {
  header: JSX.Element | React.ReactElement;
  body: JSX.Element | React.ReactElement;
};

const Table = ({ header, body }: Props) => {
  return (
    <div className="w-full border border-gray-200 rounded-lg bg-white">
      <div className="flex items-center border-b border-b-gray-200">
        {header}
      </div>
      <div>{body}</div>
    </div>
  );
};

Table.Header = Header;
Table.Row = Row;
Table.Cell = Cell;
Table.Skeleton = Skeleton;

export default Table;
