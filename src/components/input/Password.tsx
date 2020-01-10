import * as React from 'react';
import classNames from 'classnames';
import { omit } from 'lodash';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

import Input, { InputProps } from './Input';

export interface PasswordProps extends InputProps {
  readonly inputPrefixCls?: string;
  readonly action?: string;
  visibilityTogglle?: boolean;
}

export interface PasswordState {
  visible: boolean;
}

const ActionMap: Record<string, string> = {
  click: 'onClick',
  hover: 'onMouseOver'
}

export default class Password extends React.Component<PasswordProps, PasswordState> {
  input!: HTMLInputElement;

  static defaultProps = {
    inputPrefixCls: 'ant-input',
    prefixCls: 'ant-input-password',
    action: 'click',
    visibilityTogglle: true
  }

  state = {
    visible: false
  }

  onVisibleChange = () => {
    const { disabled } = this.props;
    if (disabled) {
      return;
    }
    this.setState(({ visible }) => this.setState({ visible: !visible }));
  }

  getIcon() {
    const { prefixCls, action } = this.props;
    const iconTrigger = ActionMap[action!] || '';
    const icon = this.state.visible ? EyeOutlined : EyeInvisibleOutlined;
    const iconProps = {
      [iconTrigger]: this.onVisibleChange,
      className: `${prefixCls}-icon`,
      key: 'passwordIcon',
      onMouseDown: (e: MouseEvent) => {
        // 防止失去焦点状态
        // https://github.com/ant-design/ant-design/issues/1517
        e.preventDefault();
      }
    }
    return React.createElement(icon, iconProps);
  }

  saveInput = (instance: Input) => {
    if (instance && instance.input) {
      this.input = instance.input;
    }
  }

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }

  select() {
    this.input.select();
  }

  render() {
    const {
      className,
      prefixCls,
      inputPrefixCls,
      size,
      visibilityTogglle,
      ...restProps
    } = this.props;
    const suffixIcon = visibilityTogglle && this.getIcon();
    const inputClassName = classNames(prefixCls, className, {
      [`${prefixCls}-${size}`]: !!size,
    });
    return (
      <Input
        {...omit(restProps, ['suffix'])}
        type={this.state.visible ? 'text': 'password'}
        size={size}
        className={inputClassName}
        prefixCls={inputPrefixCls}
        suffix={suffixIcon}
        ref={this.saveInput}
      />
    );
  }
}