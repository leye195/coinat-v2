'use client';

import { useEffect, useState } from 'react';
import { Modal, ModalContent } from 'ownui-system';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { cn } from '@/lib/utils';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  title: string;
  submitLabel: string;
  initialName?: string;
};

const GroupFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitLabel,
  initialName = '',
}: Props) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (isOpen) setName(initialName);
  }, [isOpen, initialName]);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} onOpenChange={() => onClose()}>
      <ModalContent className="!h-auto !w-auto !overflow-visible !bg-transparent !shadow-none">
        <div
          className={cn(
            'w-[340px] max-w-[90vw] p-6 rounded-2xl',
            'bg-surface text-fg border border-border shadow-xl',
          )}
        >
          <h2 className={cn('m-0 mb-1 text-lg font-bold')}>{title}</h2>
          <p className={cn('m-0 mb-4 text-sm text-fg-muted')}>
            관심 종목을 묶어서 관리할 그룹 이름을 입력하세요.
          </p>
          <Input
            autoFocus
            maxLength={20}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            placeholder="예: 단기 트레이딩"
            aria-label="그룹 이름"
            className={cn(
              'w-full rounded-lg px-3 py-2.5 text-sm',
              'bg-bg text-fg border border-border',
              'placeholder:text-fg-muted',
              'focus:outline-none focus:ring-2 focus:ring-[#f8b64c]/60 focus:border-[#f8b64c]',
            )}
          />
          <div className={cn('flex justify-end gap-2 mt-6')}>
            <Button
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium',
                'text-fg-muted hover:bg-bg transition-colors',
              )}
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold',
                'bg-[#f8b64c] text-black transition-opacity',
                'hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed',
              )}
              disabled={!name.trim()}
              onClick={handleSubmit}
            >
              {submitLabel}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default GroupFormModal;
