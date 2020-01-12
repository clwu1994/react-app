import * as React from 'react';
import ResizeObserver from 'rc-resize-observer';
import { omit } from 'lodash';
import classNames from 'classnames';
import calculateNodeHeight from './calculateNodeHeight';
import raf from '../_util/raf';
import { TextAreaProps } from './TextArea';

// 未做调整的
const RESIZE_STATUS_NONE = 0;
// 正在调整大小
const RESIZE_STATUS_RESIZING = 1;
// 已经调整
const RESIZE_STATUS_RESIZED = 2;

export interface AutoSizeType {
  minRows?: number;
  maxRows?: number;
}

interface TextAreaState {}
class ResizableTextArea extends React.Component<TextAreaProps, TextAreaState> {

}

export default ResizableTextArea;