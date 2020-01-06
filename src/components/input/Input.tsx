import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import { omit } from 'lodash';
import { tuple } from '../_util/type';
import ClearableLabeledInput, { hasPrefixSuffix } from './ClearableLabeledInput';
import warning from '../_util/warning';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';

export const InputSizes = tuple('small', 'default', 'large');

export function fixControlledValue<T>(value: T) {
  // 校验undefined和null
  if (value == null) {
    return '';
  }
  return value;
}

export function resolveOnChange(
  target: HTMLInputElement | HTMLTextAreaElement,
  e:
    | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    | React.MouseEvent<HTMLElement, MouseEvent>,
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
) {
  if (onChange) {
    let event = e;
    if (e.type === 'click') {
      // click clear icon
      event = Object.create(e);
      event.target = target;
      event.currentTarget = target;
      const originalInputValue = target.value;
      // change target ref value cause e.target.value should be '' when clear input
      target.value = '';
      onChange(event as React.ChangeEvent<HTMLInputElement>);
      // reset target ref value
      target.value = originalInputValue;
      return;
    }
    onChange(event as React.ChangeEvent<HTMLInputElement>);
  }
}

export function getInputClassName(
  prefixCls: string,
  size?: typeof InputSizes[number],
  disabled?: boolean
) {
  return classNames(prefixCls, {
    [`${prefixCls}-sm`]: size === 'small',
    [`${prefixCls}-lg`]: size === 'large',
    [`${prefixCls}-disabled`]: disabled
  })
}

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  prefixCls?: string;
  size?: typeof InputSizes[number];
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  allowClear?: boolean;
}

export interface InputState {
  value: any;
}

class Input extends React.Component<InputProps, InputState> {
  static defaultProps = {
    type: 'text'
  }
  static propTypes = {
    type: PropTypes.string,
    id: PropTypes.string,
    size: PropTypes.oneOf(InputSizes),
    maxLength: PropTypes.number,
    disabled: PropTypes.bool,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    className: PropTypes.string,
    addonBefore: PropTypes.node,
    addonAfter: PropTypes.node,
    prefixCls: PropTypes.string,
    onPressEnter: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    prefix: PropTypes.node,
    suffix: PropTypes.node,
    allowClear: PropTypes.bool
  }
  input!: HTMLInputElement;

  clearableInput!: ClearableLabeledInput;

  removePasswordTimeout!: number;

  constructor(props: InputProps) {
    super(props);
    const value = typeof props.value === 'undefined' ? props.defaultValue : props.value;
    this.state = {
      value
    }
  }
  
  static getDerivedStateFromProps(nextProps: InputProps) {
    if ('value' in nextProps) {
      return {
        value: nextProps.value
      }
    }
    return null;
  }

  componentDidMount() {
    this.clearPasswordValueAttribute();
  }

  // 由于polyfill`getSnapshotBeforeUpdate`需要与componentDidUpdate`一起使用。
  // 我们在此处保留一个空函数
  componentDidUpdate() {}

  /**
   * getSnapshotBeforeUpdate该生命周期发生在render在前，此时state已经改变
   * 重点关注Input时，动态添加或删除前缀/后缀将使其由于dom结构更改而失去焦点。
   * 了解更多：https：//ant.design/components/input/#FAQ
   */
  getSnapshotBeforeUpdate(prevProps: InputProps) {
    if (hasPrefixSuffix(prevProps) !== hasPrefixSuffix(this.props)) {
      warning(
        this.input !== document.activeElement,
        'Input',
        `When Input is focused, dynamic add or remove prefix / suffix will make it lose focus caused by dom structure change. Read more: https://ant.design/components/input/#FAQ`
      );
    }
    return null;
  }

  componentWillMount() {
    if (this.removePasswordTimeout) {
      clearTimeout(this.removePasswordTimeout);
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

  saveClearableInput = (input: ClearableLabeledInput) => {
    this.clearableInput = input;
  }

  saveInput = (input: HTMLInputElement) => {
    this.input = input;
  }

  setValue(value: string, callback?: () => void) {
    if (!('value' in this.props)) {
      this.setState({ value }, callback);
    }
  }

  handleReset = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setValue('', () => {
      this.focus();
    });
    resolveOnChange(this.input, e, this.props.onChange);
  }

  renderInput = (prefixCls: string) => {
    const { className, addonBefore, addonAfter, size, disabled } = this.props;
    // Fix https://fb.me/react-unknown-prop
    const otherProps = omit(this.props, [
      'prefixCls',
      'onPressEnter',
      'addonBefore',
      'addonAfter',
      'prefix',
      'suffix',
      'allowClear',
      // 输入元素必须是受控的或不受控制的，
      // 指定值prop或defaultValue属性，但不能同时指定两者。
      'defaultValue',
      'size',
      'inputType'
    ]) as React.InputHTMLAttributes<HTMLInputElement>;
    return (
      <input
        {...otherProps}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        className={classNames(getInputClassName(prefixCls, size, disabled), {
          [className!]: className && !addonBefore && !addonAfter,
        })}
        ref={this.saveInput}
      />
    );
  }

  clearPasswordValueAttribute() {
    // https://github.com/ant-design/ant-design/issues/20541
    this.removePasswordTimeout = setTimeout(() => {
      if (
        this.input &&
        this.input.getAttribute('type') === 'password' &&
        this.input.hasAttribute('value')
      ) {
        this.input.removeAttribute('value');
      }
    })
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setValue(e.target.value, this.clearPasswordValueAttribute);
    resolveOnChange(this.input, e, this.props.onChange);
  }

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { onPressEnter, onKeyDown } = this.props;
    if (e.keyCode === 13 && onPressEnter) {
      onPressEnter(e);
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  }

  renderComponent = ({ getPrefixCls }: ConfigConsumerProps) => {
    const { value } = this.state;
    const { prefixCls: customizePrefixCls } = this.props;
    const prefixCls = getPrefixCls('input', customizePrefixCls);
    return (
      <ClearableLabeledInput
        {...this.props}
        prefixCls={prefixCls}
        inputType='input'
        value={fixControlledValue(value)}
        element={this.renderInput(prefixCls)}
        handleReset={this.handleReset}
        ref={this.saveClearableInput}
      />
    )
  }

  render() {
    return <ConfigConsumer>{this.renderComponent}</ConfigConsumer>
  }
}

export default Input;