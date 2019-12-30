import { DependencyList, useCallback, useRef, useState, useEffect } from 'react';

class Timer<T> {
  // 剩余
  private remaining = 0;
  // 延迟
  private delay = 0;
  // 回调
  private cb: ((...args: any[]) => Promise<T | undefined>) | null = null
  // 起始点
  private start = 0;
  // 定时器返回的timerId
  private timerId: any = 0;

  constructor (cb: () => Promise<T | undefined>, delay: number) {
    this.remaining = delay;
    this.delay = delay;
    this.start = Date.now();
    this.cb = cb;
  }

  stop = () => {
    clearTimeout(this.timerId);
    this.timerId = 0;
    this.remaining = this.delay;
  }

  
}

export interface Options<T> {
  manual?: boolean; // 是否初始化执行
  pollingInterval?: number; // 轮询的间隔毫秒
  onSuccess?: (data: T, params?: any[]) => void; // 成功回调
  onError?: (e: Error, params?: any[]) => void; // 失败回调
  autoCancel?: boolean; // 竞态处理开关
}
type promiseReturn<T> = (...args: any[]) => Promise<T | undefined>;
type noop = (...args: any[]) => void;
export interface ReturnValue<T> {
  loading: boolean;
  error?: Error | string;
  params: any[];
  data?: T;
  cancel: noop;
  run: promiseReturn<T | undefined>;
  timer: {
    stop: noop;
    resume: noop;
    pause: noop;
  }
}
function useAsync<Result = any> (
  fn: (...args: any[]) => Promise<Result>,
  options ?: Options<Result>
): ReturnValue<Result>;

function useAsync<Result = any> (
  fn: (...args: any[]) => Promise<Result>,
  deps?: DependencyList,
  options?: Options<Result>,
): ReturnValue<Result>;

function useAsync<Result = any> (
  fn: (...args: any[]) => Promise<Result>,
  deps?: DependencyList | Options<Result>,
  options?: Options<Result>,
): ReturnValue<Result> {
  const _deps: DependencyList = (Array.isArray(deps) ? deps: []) as DependencyList;
  const _options: Options<Result> = (typeof deps === 'object' && !Array.isArray(deps)
    ? deps
    : options || {}) as Options<Result>;
  const params = useRef<any[]>([]);
  const { autoCancel = true } = _options;
}

export default useAsync;