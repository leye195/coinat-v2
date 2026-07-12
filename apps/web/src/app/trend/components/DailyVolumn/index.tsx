import { getDailyVolumnPower } from '@/api';
import DailyVolumnClient from './Client';

type DailyVolumnProps = {
  orderBy: string;
  count: number;
};

async function DailyVolumn({ count, orderBy }: DailyVolumnProps) {
  const initialData = await getDailyVolumnPower(orderBy, count);

  return (
    <DailyVolumnClient
      initialData={initialData}
      orderBy={orderBy}
      count={count}
    />
  );
}

export default DailyVolumn;
