'use client';

import { useEffect, useState } from 'react';

const useMount = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(function markMounted() {
    setIsMounted(true);
  }, []);

  return isMounted;
};

export default useMount;
