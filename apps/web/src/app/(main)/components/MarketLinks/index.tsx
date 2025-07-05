'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dropdown } from 'ownui-system';
import { DropdownSelectedItem } from 'ownui-system/dist/components/Dropdown/dropdown';
import { MARKET_INFO } from 'constant';
import { useIsomorphicLayoutEffect } from 'hooks/common';
import { cn } from '@/lib/utils';
import { useCoinStore } from '@/store/coin';

export default function MarketLinks() {
  const { type } = useCoinStore();
  const navigate = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DropdownSelectedItem | null>(
    null,
  );

  function handleSelectDropdown(name: string, value: string) {
    if (value === selectedItem?.value) return;

    setSelectedItem({
      name,
      value,
    });
    navigate.push(`/?type=${value}`);
  }

  function handleOnOpenChange(isOpen: boolean) {
    setIsOpen(isOpen);
  }

  useIsomorphicLayoutEffect(() => {
    if (type) {
      setSelectedItem(
        MARKET_INFO.find((item) => item.value === type) ?? MARKET_INFO[0],
      );
    }
  }, [type]);

  return (
    <>
      {type !== 'BTC' && selectedItem && (
        <div className="max-md:mr-1">
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
                    'max-md:min-w-[150px]',
                  )}
                >
                  {MARKET_INFO.map((item) => (
                    <Dropdown.Item
                      className={cn('px-3 py-1.5')}
                      key={item.value}
                      name={item.name}
                      value={item.value}
                    >
                      <div className={cn('flex gap-1 items-center')}>
                        <Image
                          src="/assets/icons/binance.svg"
                          alt="binance"
                          width={16}
                          height={16}
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
        </div>
      )}
    </>
  );
}
