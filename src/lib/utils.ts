import qs from 'qs';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * @description 퍼센트 비율을 구하는 함수
 * @param x  숫자
 * @param y  숫자
 */
export const getPercent = (x: number, y: number) => {
  return ((x - y) / y) * 100;
};

/**
 * @description 1,000단위 콤마, 소수점 2자리 허용
 * @param num
 */
export const setComma = (num: number): string =>
  num.toLocaleString(undefined, { maximumFractionDigits: 2 });

/**
 * @description object key 목록 반환
 * @param target  object
 * @returns key 리스트
 */
export function ownKeys(target: object) {
  return Reflect.ownKeys(target);
}

/**
 * @description object 동일 여부 체크
 * @param a  object
 * @param b  object
 * @returns a,b 객체 비교 결과
 */
export const areEqual = (a: object, b: object) => {
  const keys = Reflect.ownKeys(a);
  return (
    keys.length === Reflect.ownKeys(b).length &&
    keys.every((key) => Reflect.get(a, key) === Reflect.get(b, key))
  );
};

/**
 * @description 객체에 포함된 값들을 url에 query로 변경합니다 ex) a={a}&b={b}
 * @param param object
 * @returns string
 */
export const queryStringify = (param: object) =>
  qs.stringify(param, { skipNulls: true });

/**
 * @description breakpoint의 미디어 쿼리 조건만 반환합니다(useMedia에 사용)
 * @param mediaQuery 미디어 쿼리
 */
export const getBreakpointQuery = (mediaQuery: string): string => {
  return mediaQuery.replace(/@media /, '');
};

export const classnames = (...classnames: string[]) => {
  return classnames.join(' ');
};

export const findIndex = <T>(data: T[], prediticate: (val: T) => boolean) => {
  return data.findIndex(prediticate);
};

export const filter = <T>(data: T[], prediticate: (val: T) => boolean) => {
  return data.filter(prediticate);
};

export const equal = <T>(target: T, val: T) => target === val;

export const removeDuplicate = <T>(data: T[]) => [...new Set(data)];

export const generateUid = () => {
  const url = URL.createObjectURL(new Blob());
  const uuid = url.slice(-36);
  return uuid;
};

export const relativeTime = (datetime: string) => {
  const targetTime = new Date(datetime);
  return formatDistanceToNow(targetTime, { addSuffix: true, locale: ko });
};

export const reCalculateTimeStamp = (timestamp: number) =>
  Math.floor(timestamp / 24 / 60 / 60 / 1000) * 24 * 60 * 60 * 1000;
