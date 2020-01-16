export function getParams(ns, opt, cb) {
  let names = ns;
  let options = opt;
  let callback = cb;
  if (cb === undefined) {
    if (typeof names === 'function') {
      callback = names;
      options = {}
      names = undefined;
    } else if (Array.isArray(names)) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      } else {
        options = options || {};
      }
    } else {
      callback = options;
      options = names || {};
      names = undefined;
    }
  }
  return {
    names,
    options,
    callback
  }
}

export function isEmptyObject(obj) {
  return Object.key(obj).length === 0;
}

export function hasRules(validate) {
  if (validate) {
    return validate.some((item) => {
      return item.rules && item.rules.length;
    });
  }
  return false;
}

export function startWith(str, prefix) {
  return str.lastIndexOf(prefix, 0) === 0;
}