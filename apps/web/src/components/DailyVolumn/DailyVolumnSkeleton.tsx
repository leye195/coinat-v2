import Skeleton from '../Skeleton';

type DailyVolumnSkeletonProps = {
  rows?: number;
};

const DailyVolumnSkeleton = ({ rows = 10 }: DailyVolumnSkeletonProps) => {
  return (
    <div className="flex flex-col p-2 max-md:text-xs">
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          className="flex items-center justify-between py-[10px]"
          key={`daily-volumn-skeleton-${idx}`}
        >
          <Skeleton width="60%" height={14} borderRadius="6px" />
          <Skeleton width="20%" height={14} borderRadius="6px" />
        </div>
      ))}
    </div>
  );
};

export default DailyVolumnSkeleton;
