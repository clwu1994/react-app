import * as React from 'react';
import ClearableLabeledInput from './ClearableLabeledInput';
import ResizableTextArea, { AutoSizeType } from './ResizableTextArea';

export type HTMLTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export interface TextAreaProps extends HTMLTextareaProps {
  prefixCls?: string;
  autoSize?: boolean | AutoSizeType;
  onPressEnter?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  allowClear?: boolean;
  onResize?: (size: { width: number, height: number }) => void;
}
export interface TextAreaState {
  value: any;
}
class TextArea extends React.Component<TextAreaProps, TextAreaState> {
  resizableTextArea: ResizableTextArea;
}

export default TextArea;