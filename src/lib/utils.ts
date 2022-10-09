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
