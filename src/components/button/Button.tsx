import * as React from 'react';
import * as PropTypes from 'prop-types';
import Group from './ButtonGroup';
import { tuple } from '../_util/type';

function isString(str: any) {
  return typeof str === 'string';
}

// 按钮类型：默认、主题色、幽灵、虚线、危险、导航
const ButtonTypes = tuple('default', 'primary', 'ghost', 'dashed', 'danger', 'link');
export type ButtonType = (typeof ButtonTypes)[number];

// 按钮形状：圆、矩形
const ButtonShapes = tuple('circle', 'circle-outline', 'round');
export type ButtonShape = (typeof ButtonShapes)[number];

// 按钮大小：大、默认、小
const ButtonSizes = tuple('large', 'default', 'small');
export type ButtonSize = (typeof ButtonSizes)[number];

// 按钮原生类型：提交、普通、重置
const ButtonHTMLTypes = tuple('submit', 'button', 'reset');
export type ButtonHTMLType = (typeof ButtonHTMLTypes)[number];

export interface BaseButtonProps {
  type?: ButtonType;
  icon?: string;
  shape?: ButtonShape;
  size?: ButtonSize;
  loading?: boolean | { delay?: number };
  prefixCls?: string;
  className?: string;
  ghost?: boolean;
  // 将按钮宽度调整为其父宽度的选项
  block?: boolean;
  children?: React.ReactNode;
}

// 锚Button属性
export type AnchorButtonProps = {
  href: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps &
Omit<React.AnchorHTMLAttributes<any>, 'type' | 'onClick'>;

// 原生Button属性
export type NativeButtonProps = {
  htmlType?: ButtonHTMLType;
  onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps &
Omit<React.ButtonHTMLAttributes<any>, 'type' | 'onClick'>;

export type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps>;

interface ButtonState {
  loading?: boolean | { delay?: number };
  hasTwoCNChar: boolean;
}

class Button extends React.Component<ButtonProps, ButtonState> {
  static Group: typeof Group;

  static __ANT_BUTTON = true;

  static defaultProps = {
    loading: false,
    ghost: false,
    block: false,
    htmlType: 'button'
  }

  static protoTypes = {
    type: PropTypes.string,
    shape: PropTypes.oneOf(ButtonShapes),
    size: PropTypes.oneOf(ButtonSizes),
    htmlType: PropTypes.oneOf(ButtonHTMLTypes),
    onClick: PropTypes.func,
    loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    className: PropTypes.string,
    icon: PropTypes.string,
    block: PropTypes.bool,
    title: PropTypes.string
  }

  private delayTimeout!: number;

  private buttonNode!: HTMLElement | null;

  constructor(props: ButtonProps) {
    super(props);
    this.state = {
      loading: props.loading,
      hasTwoCNChar: false
    }
  }

  componentDidMount() {
    this.fixTwoCNChar();
  }
  
  saveButtonRef = (node: HTMLElement | null) => {
    this.buttonNode = node;
  }

  handleClick: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement> = e => {
    const { loading } = this.state;
    const { onClick } = this.props;
    if (loading) {
      return;
    }
    if (onClick) {
      (onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)(e);
    }
  }
  fixTwoCNChar() {}
}

export default Button;