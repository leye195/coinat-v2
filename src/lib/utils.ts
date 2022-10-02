/**
 * @description 퍼센트 비율을 구하는 함수
 * @param x  숫자
 * @param y  숫자
 */
export const getPercent = (x: number, y: number) => {
  return ((x - y) / y) * 100;
};

/**
 * @description 1,000단위 콤마
 * @param num
 */
export const setComma = (num: number): string =>
  num.toLocaleString(undefined, { maximumFractionDigits: 2 });
