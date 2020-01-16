import createContext, { Context } from '@ant-design/create-react-context';

import * as React from 'react';
import classNames from 'classnames';
import isNumeric from '../_util/isNumeric'
import { BarsOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import { omit } from 'lodash';
import { LayoutContextProps } from './Layout';
import { ConfigConsumerProps } from '../config-provider';
export type SiderTheme = 'light' | 'dark';

const dimensionMaxMap = {
  xs: '479.98px',
  sm: '575.98px',
  md: '767.98px',
  lg: '991.98px',
  xl: '1199.98px',
  xxl: '1599.98px'
}

// 折叠类型是媒体查询响应式触发，还是鼠标点击触发
export type CollapseType = 'clickTrigger' | 'responsive';

export interface SiderProps extends React.HTMLAttributes<HTMLDivElement> {
  // 前缀
  prefixCls?: string;
  // 是否可收起
  collapsible?: boolean;
  // 当前收起状态
  collapsed?: boolean;
  // 是否默认收起
  defaultCollapsed?: boolean;
  // 翻转折叠提示箭头的方向，当 Sider 在右边时可以使用
  reverseArrow?: boolean;

  // 自定义 trigger，设置为 null 时隐藏 trigger
  trigger?: React.ReactNode;
  // 宽度
  width?: number | string;
  // 展开-收起时的回调函数，有点击 trigger 以及响应式反馈两种方式可以触发
  onCollapse?: (collapsed: boolean, type: CollapseType) => void;
  // 指定当 collapsedWidth 为 0 时出现的特殊 trigger 的样式
  zeroWidthTriggerStyle?: React.CSSProperties;
  // 收缩宽度，设置为 0 会出现特殊 trigger
  collapsedWidth?: number | string;
  // 触发响应式布局的断点
  breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  // 主题颜色
  theme?: SiderTheme;
  // 触发响应式布局断点时的回调
  onBreakpoint?: (broken: boolean) => void
}

type InternalSideProps = SiderProps & LayoutContextProps

export interface SiderState {
  // 已收起
  collapsed?: boolean;
  // 下面
  below: boolean;
  // 下面显示
  belowShow?: boolean;
}

// 返回一个函数，生成`${prefix}1`，`${prefix}2`，`${prefix}3`...
const generateId = (() => {
  let i = 0;
  return (prefix: string = '') => {
    i += 1;
    return `${prefix}${i}`;
  }
})();

class InternalSider extends React.Component<InternalSideProps, SiderState> {
  static defaultProps = {
    // 不可收起
    collapsible: false,
    // 展开的
    defaultCollapsed: false,
    // 不翻转折叠提示箭头
    reverseArrow: false,
    width: 200,
    // 搜索宽度80，自动收起
    collapsedWidth: 80,
    style: {},
    theme: 'dark' as SiderTheme
  }

  static getDerivedStateFromProps(nextProps: InternalSideProps) {
    if ('collapsed' in nextProps) {
      return {
        collapsed: nextProps.collapsed
      }
    }
    return null;
  }
  // 媒体查询列表
  private mql!: MediaQueryList;
  private uniqueId!: string;

  constructor(props: InternalSideProps) {
    super(props);
    this.uniqueId = generateId('ant-sider-');
    // mql = window.matchMedia(mediaQueryString)
    // 返回一个新的MediaQueryList 对象，表示指定的媒体查询字符串解析后的结果
    let matchMedia;
    if (typeof window !== 'undefined') {
      matchMedia = window.matchMedia;
    }
    if (matchMedia && props.breakpoint && props.breakpoint in dimensionMaxMap) {
      this.mql = matchMedia(`(max-width: ${dimensionMaxMap[props.breakpoint]})`);
    }
    let collapsed;
    if ('collapsed' in props) {
      collapsed = props.collapsed;
    } else {
      collapsed = props.defaultCollapsed;
    }
    this.state = {
      collapsed,
      below: false
    }
  }

  componentDidMount() {
    if (this.mql) {
      this.mql.addListener(this.responsiveHandler)
      this.responsiveHandler(this.mql)
    }
  }

  componentWillUnmount() {
    if (this.mql) {
      this.mql.removeListener(this.responsiveHandler);
    }
    if (this.props.siderHook) {
      this.props.siderHook.removeSider(this.uniqueId);
    }
  }

  responsiveHandler = (mql: MediaQueryListEvent | MediaQueryList) => {
    this.setState({ below: mql.matches });
    const { onBreakpoint } = this.props;
    if (onBreakpoint) {
      onBreakpoint(mql.matches);
    }
    if (this.state.collapsed !== mql.matches) {
      this.setCollapsed(mql.matches, 'responsive');
    }
  }

  setCollapsed = (collapsed: boolean, type: CollapseType) => {
    if (!('collapsed' in this.props)) {
      this.setState({
        collapsed
      })
    }
    const { onCollapse } = this.props;
    if (onCollapse) {
      onCollapse(collapsed, type);
    }
  }

  toggle = () => {
    const collapsed = !this.state.collapsed;
    this.setCollapsed(collapsed, 'clickTrigger');
  }

  belowShowChange = () => {
    this.setState(({ belowShow }) => ({ belowShow: !belowShow }))
  }

  // 渲染侧栏
  renderSider = ({ getPrefixCls }: ConfigConsumerProps) => {
    const {
      prefixCls: customizePrefixCls,
      className,
      theme,
      collapsible,
      reverseArrow,
      trigger,
      style,
      width,
      collapsedWidth,
      zeroWidthTriggerStyle,
      ...others
    } = this.props;
    const prefixCls = getPrefixCls('layout-sider', customizePrefixCls);
    const divProps = omit(others, [
      'collapsed',
      'defaultCollapsed',
      'onCollapse',
      'breakpoint',
      'onBreakpoint',
      'siderHook',
      'zeroWidthTriggerStyle'
    ]);
    const rawWidth = this.state.collapsed ? collapsedWidth : width;
    // 使用“ px”作为宽度的后备单位
    const siderWidth = isNumeric(rawWidth) ? `${rawWidth}px` : String(rawWidth);
    // 特别的触发器当collapsedWidth == 0
    const zeroWidthTrigger = parseFloat(String(collapsedWidth || 0)) === 0 ? (
      <span
        onClick={this.toggle}
        className={`${prefixCls}-zero-width-trigger ${prefixCls}-zero-width-trigger-${
          reverseArrow ? 'right' : 'left'
        }`}
        style={zeroWidthTriggerStyle}
      >
        <BarsOutlined />
      </span>
    ): null;
    const iconObj = {
      // 展开的
      expanded: reverseArrow ? <RightOutlined /> : <LeftOutlined />,
      // 收起的
      collapsed: reverseArrow ? <LeftOutlined /> : <RightOutlined />
    }
    const status = this.state.collapsed ? 'collapsed' : 'expanded';
    const defaultTrigger = iconObj[status];
    const triggerDom =
      trigger !== null
      ? zeroWidthTrigger || (
        <div
          className={`${prefixCls}-trigger`}
          onClick={this.toggle}
          style={{ width: siderWidth }}
        >
          {trigger || defaultTrigger}
        </div>
      )
      : null;
    const divStyle = {
      ...style,
      flex: `0 0 ${siderWidth}`,
      maxWidth: siderWidth,
      minWidth: siderWidth,
      width: siderWidth
    }
  }
}