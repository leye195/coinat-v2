'use client';

import { useState } from 'react';
import { useIsomorphicLayoutEffect } from '@/hooks';
import { getLocalStorageData, setLocalStorageData } from '@/lib/storage';

function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);

  const updateValue = (value: T) => {
    setValue(value);
    setLocalStorageData(key, value);
  };

  useIsomorphicLayoutEffect(() => {
    const storedData = (getLocalStorageData(key) ?? defaultValue) as T;

    if (storedData === defaultValue) {
      setLocalStorageData(key, storedData);
      return;
    }

    setValue(storedData);
  }, []);

  return { value, updateValue };
}

export default useLocalStorage;
