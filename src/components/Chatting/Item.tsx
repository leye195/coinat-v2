import { cn } from '@/lib/utils';

type Props = {
  nickname: string;
  message: string;
};

const Item = ({ message, nickname }: Props) => {
  return (
    <div className={cn('flex items-center')}>
      <p className="m-0 font-normal">
        <span className="font-semibold">{nickname}:</span> {message}
      </p>
    </div>
  );
};

export default Item;
