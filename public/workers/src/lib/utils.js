import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import qs from 'qs';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
/**
 * @description 퍼센트 비율을 구하는 함수
 * @param x  숫자
 * @param y  숫자
 */
export const getPercent = (x, y) => {
    return ((x - y) / y) * 100;
};
/**
 * @description 1,000단위 콤마, 소수점 2자리 허용
 * @param num
 */
export const setComma = (num) => num.toLocaleString(undefined, { maximumFractionDigits: 2 });
/**
 * @description object key 목록 반환
 * @param target  object
 * @returns key 리스트
 */
export function ownKeys(target) {
    return Reflect.ownKeys(target);
}
/**
 * @description object 동일 여부 체크
 * @param a  object
 * @param b  object
 * @returns a,b 객체 비교 결과
 */
export const areEqual = (a, b) => {
    const keys = Reflect.ownKeys(a);
    return (keys.length === Reflect.ownKeys(b).length &&
        keys.every((key) => Reflect.get(a, key) === Reflect.get(b, key)));
};
/**
 * @description 객체에 포함된 값들을 url에 query로 변경합니다 ex) a={a}&b={b}
 * @param param object
 * @returns string
 */
export const queryStringify = (param) => qs.stringify(param, { skipNulls: true });
/**
 * @description breakpoint의 미디어 쿼리 조건만 반환합니다(useMedia에 사용)
 * @param mediaQuery 미디어 쿼리
 */
export const getBreakpointQuery = (mediaQuery) => {
    return mediaQuery.replace(/@media /, '');
};
export const classnames = (...classnames) => {
    return classnames.join(' ');
};
export const findIndex = (data, prediticate) => {
    return data.findIndex(prediticate);
};
export const filter = (data, prediticate) => {
    return data.filter(prediticate);
};
export const equal = (target, val) => target === val;
export const removeDuplicate = (data) => [...new Set(data)];
export const generateUid = () => {
    const url = URL.createObjectURL(new Blob());
    const uuid = url.slice(-36);
    return uuid;
};
export const relativeTime = (datetime) => {
    const targetTime = new Date(datetime);
    return formatDistanceToNow(targetTime, { addSuffix: true, locale: ko });
};
export const reCalculateTimeStamp = (timestamp) => Math.floor(timestamp / 24 / 60 / 60 / 1000) * 24 * 60 * 60 * 1000;
