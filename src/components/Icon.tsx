import { useEffect, useRef, useState } from 'react';
import Skeleton from '@/components/Skeleton';

type Props = {
  name: string;
  width: number;
  height: number;
  borderRadius?: number | string;
};

const Icon = ({ name, width, height, borderRadius = '8px' }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    import(`../../public/assets/icons/${name}.svg`).then((mod) => {
      ref.current = mod.default;
      setIsLoading(false);
    });
  }, [name]);

  if (ref.current) {
    const { current: SVG } = ref;

    return (
      <Skeleton
        display="flex"
        alignItems="center"
        justifyContent="center"
        width={`${width}px`}
        height={`${height}px`}
        borderRadius={borderRadius}
        isLoaded={!isLoading}
      >
        <SVG width={width} height={height} />
      </Skeleton>
    );
  }

  return (
    <Skeleton
      width={`${width}px`}
      height={`${height}px`}
      borderRadius={borderRadius}
    >
      <div />
    </Skeleton>
  );
};

export default Icon;
