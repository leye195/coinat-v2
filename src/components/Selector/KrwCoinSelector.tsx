import { useLayoutEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dropdown } from 'ownui-system';
import { DropdownSelectedItem } from 'ownui-system/dist/components/Dropdown/dropdown';
import { useCoinList } from 'hooks/queries';
import { cn } from '@/lib/utils';

interface KrwCoinSelectorProps {
  code?: string;
}

const KrwCoinSelector = ({ code }: KrwCoinSelectorProps) => {
  const { krwCoinData } = useCoinList();
  const navigate = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DropdownSelectedItem | null>(
    null,
  );

  function handleSelectDropdown(_: string, value: string) {
    if (value === selectedItem?.value) return;

    navigate.push(`/trading-view?code=${value}`, {});
  }

  function handleOnOpenChange(isOpen: boolean) {
    setIsOpen(isOpen);
  }

  useLayoutEffect(() => {
    if (code && krwCoinData) {
      const info = krwCoinData.find(({ name }) => name === code);

      if (!info) return;

      setSelectedItem({
        name: info.name,
        value: info.name,
        image: info.img,
      });
    }
  }, [code, krwCoinData]);

  if (!selectedItem) return null;

  return (
    <Dropdown
      isOpen={isOpen}
      header={
        <Dropdown.Header
          className={cn(
            'px-3 py-1.5 rounded-md min-w-[180px]',
            'max-md:min-w-[150px]',
          )}
        />
      }
      body={
        <Dropdown.Content>
          <Dropdown.Body
            className={cn(
              'min-w-[180px] bg-white',
              'max-md:min-w-[150px] h-[300px] overflow-auto scroll-m-0',
            )}
          >
            {krwCoinData.map((item) => (
              <Dropdown.Item
                className={cn('px-3 py-1.5')}
                key={item.name}
                name={item.name}
                value={item.name}
              >
                <div className={cn('flex gap-1 items-center')}>
                  <Image
                    src={`https://static.upbit.com/logos/${item.name}.png`}
                    alt="binance"
                    width={16}
                    height={16}
                    unoptimized
                  />
                  {item.name}
                </div>
              </Dropdown.Item>
            ))}
          </Dropdown.Body>
        </Dropdown.Content>
      }
      selectedItem={selectedItem}
      onSelect={handleSelectDropdown}
      onOpenChange={handleOnOpenChange}
    />
  );
};

export default KrwCoinSelector;
