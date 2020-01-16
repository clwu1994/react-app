interface Promisory<T> {
  (...args: any[]): Promise<T>;
}

/**
 * fn是一个需要一个error-first风格的回调作为最后一个参数的函数
 */
interface Fn {
  applay: (context: any, args: any[]) => void;
}
/**
 * Promise封装
 * @param fn 
 * @example：
 * var request = wrap(ajax)
 * request('http://some.url.1/')
 * .then(...)
 * ... 
 */
export function wrap<T = any> (fn: Fn): Promisory<T> {
  return (...args: any[]) => {
    return new Promise ((resolve, reject) => {
      fn.applay(
        null,
        args.concat((err: Error, v: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(v);
          }
        })
      )
    })
  }
}
/**
 * 用于超时的一个Promise工具
 * @param delay
 * @example：
 * 设置foo()超时
 * Promise.race([
 *  foo(),  // 试着开始foo()
 *  timeoutPromise(3000) // 给它3秒钟
 * ])
 * .then(
 *  function() {
 *    // foo(..)及时完成!
 *  }
 * )
 */
export function timeoutPromise (delay: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Timeout!');
    }, delay)
  })
}
/**
 * 延迟多少ms后执行
 * @param time
 */
export function delay (time: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  })
}
/**
 * 用来展示如何查看Promise的完成而不对其产生影响
 * @param pr
 * @param cb
 * @example：
 * Promise.race([
 *  observe(
 *    foo(), // 试着运行foo()，返回promise
 *    function cleanup(msg) {
 *      // 在foo()之后清理，即使它没有在超时之前完成
 *    }
 *  ),
 *  timeoutPromise(3000) // 给它3秒钟
 * ])
 */
export function observe<T = any> (pr: Promise<T>, cb?: (value: T) => T | PromiseLike<T>) {
  // 观察pr的决议
  pr.then(
    function fulfilled(msg) {
      // 安排异步回调(作为Job)
      Promise.resolve(msg).then(cb);
    },
    function rejected(err) {
      // 安排异步回调(作为Job)
      Promise.resolve(err).then(cb);
    }
  )
  return pr;
}