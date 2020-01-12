import * as React from 'react';
import { omit } from 'lodash';
import classNames from 'classnames'; 
import { TextAreaProps } from './TextArea';

export interface AutoSizeType {
  minRows?: number;
  maxRows?: number;
}

interface TextAreaState {}
class ResizableTextArea extends React.Component<TextAreaProps, TextAreaState> {

}

export default ResizableTextArea;