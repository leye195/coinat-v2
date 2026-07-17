import { cn } from '@/lib/utils';
import Cell from './Cell';
import Header from './Header';
import Row from './Row';
import Skeleton from './Skeleton';

type Props = {
  header: JSX.Element | React.ReactElement;
  body: JSX.Element | React.ReactElement;
  // Drop the outer border/background/rounding so the table can sit inside an
  // already-bordered container (e.g. the watchlist market cards).
  bare?: boolean;
};

const Table = ({ header, body, bare = false }: Props) => {
  return (
    <div
      className={cn(
        'w-full',
        bare ? 'text-[13px]' : 'rounded-lg border border-border bg-surface',
      )}
    >
      <div className="flex items-center border-b border-b-border">{header}</div>
      <div>{body}</div>
    </div>
  );
};

Table.Header = Header;
Table.Row = Row;
Table.Cell = Cell;
Table.Skeleton = Skeleton;

export default Table;
