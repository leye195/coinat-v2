import Cell from './Cell';
import Header from './Header';
import Row from './Row';
import Skeleton from './Skeleton';

type Props = {
  header: JSX.Element | React.ReactElement;
  body: JSX.Element | React.ReactElement;
};

const Table = ({ header, body }: Props) => {
  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white">
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
