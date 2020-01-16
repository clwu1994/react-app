import ReactDOM from 'react-dom';

/**
 * 如果节点是DOM节点，则返回。 否则将通过`findDOMNode`返回
 */
export default function findDOMNode<T = Element | Text>(
  node: React.ReactInstance | HTMLElement
): T {
  if (node instanceof HTMLElement) {
    return (node as unknown) as T;
  }
  return (ReactDOM.findDOMNode(node) as unknown) as T;
}