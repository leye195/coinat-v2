import { useEffect, useLayoutEffect } from 'react';

/**
 * serverside에서 useLayoutEffect에 대한 경고 메시지가 발생하는 이슈 관련
 * clientside인 경우 useLayoutEffect, serverside인 경우 useEffect를 사용하도록 하는 목적의 커스텀 훅
 */

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
