import React from 'react';

const unsafeLifecyclesPolyfill = Component => {
  const { prototype } = Component;
  if (!prototype || !prototype.isReactComponent) {
    throw new Error('Can only polyfill class components');
  }

  // 仅处理componentWillReceiveProps
  if (typeof prototype.componentWillReceiveProps !== 'function') {
    return Component;
  }
  // 在React 16.9中，React.Profiler与UNSAFE_componentWillReceiveProps一起被引入
  // https://reactjs.org/blog/2019/08/08/react-v16.9.0.html#performance-measurements-with-reactprofiler
  if (!React.Profiler) {
    return Component;
  }

  // 从这里开始polyfill
  prototype.UNSAFE_componentWillReceiveProps = prototype.componentWillReceiveProps;
  delete prototype.componentWillReceiveProps;

  return Component;
}

export default unsafeLifecyclesPolyfill;