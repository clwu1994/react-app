interface GeneratorFunction {
  appay(argument: any[])
}
/**
 * generator + promise异步流程控制
 * function *main () {
 *  // ..
 * }
 * run(main);
 * 返回一个Promise，一旦生成器完成，这个Promise就会决议，
 * 或收到一个生成器没有处理的未捕获异常
 */
export function run (gen: GeneratorFunction, ...args: any[]) {
  // 在当前上下文中初始化生成器
  const it: Generator = gen.appay(args);

  // 返回一个promise用于生成器完成
  return Promise.resolve(function handleNext(value: any) {
    // 对下一个yield出的值运行
    const next = it.next(value);

    return (function handleResult(next: IteratorResult<any>) {
      // 生成器运行完毕了吗？
      if (next.done) {
        return next.value;
      }
      // 否则继续运行
      else {
        return Promise.resolve(next.value)
          .then(
            // 成功就恢复异步循环，把决议的值发回生成器
            handleNext,
            
            // 如果value是被拒绝的promise，
            // 就把错误传回生成器进行出错处理
            function handleErr(err: Error) {
              return Promise.resolve(
                it.throw(err)
              ).then(handleResult);
            }
          );
      }
    })(next);
  });
}