import { ClassValue } from 'clsx';
import type { CandleType } from '@/types/Candle';
export declare function cn(...inputs: ClassValue[]): string;
/**
 * @description 퍼센트 비율을 구하는 함수
 * @param x  숫자
 * @param y  숫자
 */
export declare const getPercent: (x: number, y: number) => number;
/**
 * @description 1,000단위 콤마, 소수점 2자리 허용
 * @param num
 */
export declare const setComma: (num: number, maximumFractionDigits?: number) => string;
/**
 * @description object key 목록 반환
 * @param target  object
 * @returns key 리스트
 */
export declare function ownKeys(target: object): (string | symbol)[];
/**
 * @description object 동일 여부 체크
 * @param a  object
 * @param b  object
 * @returns a,b 객체 비교 결과
 */
export declare const areEqual: (a: object, b: object) => boolean;
/**
 * @description 객체에 포함된 값들을 url에 query로 변경합니다 ex) a={a}&b={b}
 * @param param object
 * @returns string
 */
export declare const queryStringify: (param: object) => string;
/**
 * @description breakpoint의 미디어 쿼리 조건만 반환합니다(useMedia에 사용)
 * @param mediaQuery 미디어 쿼리
 */
export declare const getBreakpointQuery: (mediaQuery: string) => string;
export declare const classnames: (...classnames: string[]) => string;
export declare const findIndex: <T>(data: T[], prediticate: (val: T) => boolean) => number;
export declare const filter: <T>(data: T[], prediticate: (val: T) => boolean) => T[];
export declare const equal: <T>(target: T, val: T) => boolean;
export declare const removeDuplicate: <T>(data: T[]) => T[];
export declare const generateUid: () => string;
export declare const relativeTime: (datetime: string) => string;
export declare const reCalculateTimeStamp: (timestamp: number, type?: CandleType) => number;
export declare const formatPrice: (price: number, exchangeRate: number, symbol: string) => string;
//# sourceMappingURL=utils.d.ts.map