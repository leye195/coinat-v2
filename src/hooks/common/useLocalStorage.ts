'use client';

import { useState } from 'react';
import { useIsomorphicLayoutEffect } from '@/hooks';
import { getLocalStorageData, setLocalStorageData } from '@/lib/storage';

type UseLocalStorageProps = {
  key: string;
  defaultValue?: any;
};

const useLocalStorage = ({ key, defaultValue }: UseLocalStorageProps) => {
  const [value, setValue] = useState(defaultValue);

  const updateValue = (value: any) => {
    setValue(value);
    setLocalStorageData(key, value);
  };

  useIsomorphicLayoutEffect(() => {
    const storedData = getLocalStorageData(key) ?? defaultValue;

    if (storedData === defaultValue) {
      setLocalStorageData(key, storedData);
      return;
    }

    setValue(storedData);
  }, []);

  return { value, updateValue };
};

export default useLocalStorage;
