import Header from '@/components/Layout/Header';
import { cn } from '@/lib/utils';

type Props = {
  children?: React.ReactNode;
  isHideHeader?: boolean;
};

const Layout = ({ children, isHideHeader }: Props) => {
  return (
    <>
      {!isHideHeader && <Header />}
      <main className="relative min-h-[calc(100vh-48px)]">
        <div
          className={cn(
            'max-w-[1410px] h-full',
            'mx-auto my-0 px-3 pt-0 pb-4',
            'max-md:px-0 max-md:py-2',
            'max-sm:px-0 max-sm:py-0.5',
          )}
        >
          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;
