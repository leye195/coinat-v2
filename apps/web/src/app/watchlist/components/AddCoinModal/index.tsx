'use client';

import { useMemo, useState } from 'react';
import { Icon, Modal, ModalContent } from 'ownui-system';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getCoinSymbolImage } from '@/lib/coin';
import { cn } from '@/lib/utils';
import { Coin } from '@/types/Coin';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  coinData: Coin[];
  selectedSymbols: string[];
  onToggle: (symbol: string, checked: boolean) => void;
};

const AddCoinModal = ({
  isOpen,
  onClose,
  groupName,
  coinData,
  selectedSymbols,
  onToggle,
}: Props) => {
  const [keyword, setKeyword] = useState('');

  const selectedSet = useMemo(
    () => new Set(selectedSymbols),
    [selectedSymbols],
  );

  const filtered = useMemo(() => {
    const trimmed = keyword.trim().toLowerCase();
    const list = (coinData || []).filter(({ name }) => name !== 'BTC');
    if (!trimmed) return list;
    return list.filter(({ name }) => name.toLowerCase().includes(trimmed));
  }, [coinData, keyword]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} onOpenChange={() => onClose()}>
      <ModalContent className="!h-auto !w-auto !overflow-visible !bg-transparent !shadow-none">
        <div
          className={cn(
            'w-[380px] max-w-[92vw] rounded-2xl',
            'bg-surface text-fg border border-border shadow-xl',
            'flex flex-col max-h-[70vh]',
          )}
        >
          <div
            className={cn('flex items-start justify-between', 'px-5 pt-5 pb-3')}
          >
            <div className={cn('min-w-0')}>
              <h2 className={cn('m-0 text-lg font-bold')}>종목 추가</h2>
              <p className={cn('m-0 mt-0.5 text-sm text-fg-muted truncate')}>
                {groupName}
              </p>
            </div>
            <Button
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-md',
                'text-fg-muted hover:bg-bg hover:text-fg transition-colors',
              )}
              aria-label="닫기"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faXmark} />
            </Button>
          </div>

          <div className={cn('px-5')}>
            <div className={cn('relative')}>
              <span
                className={cn(
                  'absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted',
                  'pointer-events-none',
                )}
              >
                <Icon name="Search" size={16} />
              </span>
              <Input
                autoFocus
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="코인 검색 (예: BTC)"
                aria-label="코인 검색"
                className={cn(
                  'w-full rounded-lg pl-9 pr-3 py-2.5 text-sm',
                  'bg-bg text-fg border border-border',
                  'placeholder:text-fg-muted',
                  'focus:outline-none focus:ring-2 focus:ring-[#f8b64c]/60 focus:border-[#f8b64c]',
                )}
              />
            </div>
          </div>

          <ul
            className={cn(
              'mt-3 px-2 pb-2 overflow-y-auto flex-1 max-h-[320px]',
            )}
          >
            {filtered.length === 0 ? (
              <li
                className={cn(
                  'flex flex-col items-center justify-center gap-2 py-12',
                  'text-fg-muted',
                )}
              >
                <Icon name="SearchX" size={22} />
                <span className={cn('text-sm')}>검색 결과가 없습니다.</span>
              </li>
            ) : (
              filtered.map(({ name }) => {
                const checked = selectedSet.has(name);
                return (
                  <li key={name}>
                    <label
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                        'cursor-pointer transition-colors',
                        checked ? 'bg-[#f8b64c]/10' : 'hover:bg-bg',
                      )}
                    >
                      <picture>
                        <img
                          className="w-6 min-w-5 rounded-full"
                          alt={name}
                          src={getCoinSymbolImage(name)}
                          width={24}
                          height={24}
                        />
                      </picture>
                      <span
                        className={cn(
                          'flex-1 text-sm',
                          checked && 'font-semibold',
                        )}
                      >
                        {name}
                      </span>
                      <span
                        className={cn(
                          'flex items-center justify-center w-5 h-5 rounded-md border transition-colors',
                          checked
                            ? 'bg-[#f8b64c] border-[#f8b64c] text-black'
                            : 'border-border',
                        )}
                      >
                        {checked && <Icon name="Check" size={14} />}
                      </span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={(e) => onToggle(name, e.target.checked)}
                      />
                    </label>
                  </li>
                );
              })
            )}
          </ul>

          <div
            className={cn(
              'flex items-center justify-between gap-3',
              'px-5 py-3 border-t border-border',
            )}
          >
            <span className={cn('text-sm text-fg-muted')}>
              <span className={cn('font-semibold text-fg')}>
                {selectedSymbols.length}
              </span>
              개 선택됨
            </span>
            <Button
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold',
                'bg-[#f8b64c] text-black hover:opacity-90 transition-opacity',
              )}
              onClick={onClose}
            >
              완료
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default AddCoinModal;
