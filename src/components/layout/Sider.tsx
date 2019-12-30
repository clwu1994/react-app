import createContext, { Context } from '@ant-design/create-react-context';

import * as React from 'react';
import classNames from 'classnames';
export type SiderTheme = 'light' | 'dark';

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
  // 主题颜色
  theme?: SiderTheme;
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
  // 触发响应式布局断点时的回调
  onBreakpoint?: (broken: boolean) => void
}