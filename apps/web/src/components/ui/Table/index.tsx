import Cell from '@/components/ui/Table/Cell';
import Header from '@/components/ui/Table/Header';
import Row from '@/components/ui/Table/Row';
import Skeleton from '@/components/ui/Table/Skeleton';

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
