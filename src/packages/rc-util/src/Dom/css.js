/* eslint-disable no-nested-ternary */
const PIXEL_PATTERN = /margin|padding|width|height|max|min|offset/;

const removePixel = {
  left: true,
  top: true
}

const floatMap = {
  cssFloat: 1,
  styleFloat: 1,
  float: 1
}

// 节点类型为元素 node.ownerDocument.defaultView为window对象
function getComputedStyle(node) {
  return node.nodeType === 1 ? node.ownerDocument.defaultView.getComputedStyle(node, null): {}
}

// 不明觉厉，写的什么东东？
function getStyleValue(node, type, value) {
  type = type.toLowerCase();
  if (value === 'auto') {
    if (type === 'height') {
      return node.offsetHeight;
    }
    if (type === 'width') {
      return node.offsetWidth;
    }
  }
  /** 既不是left也不是top，当type满足PIXEL_PATTERN正则模式，设置对应的removePixel */
  if (!(type in removePixel)) {
    removePixel[type] = PIXEL_PATTERN.test(type);
  }
  return removePixel[type] ? (parseFloat(value) || 0) : value;
}

// 获取文档尺寸，即最外层元素的scroll宽度，高度
export function getDocSize() {
  const width = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  const height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  return {
    width,
    height
  }
}

/**
 * ？为什么width和height还不一样
 * window.innerHeight兼容性不支持IE6-8
 * document.documentElement.clientHeight兼容性可以支持到IE6-10
 */
export function getClientSize() {
  const width = document.documentElement.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight;
  return {
    width,
    height
  }
}

// 返回最外层容器的scrollLeft和scrollTop
export function getScroll() {
  return {
    scrollLeft: Math.max(document.documentElement.scrollLeft, document.body.scrollLeft),
    scrollTop: Math.max(document.documentElement.scrollTop, document.body.scrollTop)
  }
}

export function getOffset(node) {
  // Element.getBoundingClientRect()方法返回元素的大小及其相对于视口的位置
  const box = node.getBoundingClientRect();
  const docElem = document.documentElement;

  // < ie8 不支持 win.pageXOffset, 则使用 docElem.scrollLeft
  return {
    left: box.left + (window.pageXOffset || docElem.scrollLeft) -
      (docElem.clientLeft || document.body.clientLeft || 0),
    top: box.top + (window.pageYOffset || docElem.scrollTop) -
      (docElem.clientTop || document.body.clientTop || 0),
  }
}