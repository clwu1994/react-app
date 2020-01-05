/** T忽略K的部分 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/** 返回字符串数组 */
export const tuple = <T extends string[]>(...args: T) => args;

/** 返回数字数组 */
export const tupleNum = <T extends number[]>(...args: T) => args;
