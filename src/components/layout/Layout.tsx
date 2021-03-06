import React, { Children } from 'react';
import createContext from '@ant-design/create-react-context';
import classNames from 'classnames';
import { SiderProps } from './Sider';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider'
export interface GeneratorProps {
  // 后缀
  suffixCls: string,
  // 标签名
  tagName: 'header' | 'footer' | 'main' | 'section';
}
export interface BasicProps extends React.HTMLAttributes<HTMLDivElement> {
  // 前缀
  prefixCls?: string;
  // 是否有Sider
  hasSider?: boolean;
}

export interface LayoutContextProps {
  siderHook: {
    addSider: (id: string) => void;
    removeSider: (id: string) => void;
  }
}

export const LayoutContext = createContext<LayoutContextProps>({
  siderHook: {
    addSider: () => null,
    removeSider: () => null
  }
});

interface BasicPropsWithTagName extends BasicProps {
  tagName: 'header' | 'footer' | 'main' | 'section'
}

function generator ({ suffixCls, tagName }: GeneratorProps) {
  return (BasicComponent: any) => {
    return class Adapter extends React.Component<BasicProps, any> {
      static Header: any;

      static Footer: any;

      static Content: any;

      static Sider: any;

      renderComponent = ({ getPrefixCls }: ConfigConsumerProps) => {
        const { prefixCls: customizePrefixCls } = this.props;
        const prefixCls = getPrefixCls(suffixCls, customizePrefixCls);
        return <BasicComponent prefixCls={prefixCls} tagName={tagName} {...this.props} />;
      }
      render () {
        return <ConfigConsumer>{this.renderComponent}</ConfigConsumer>;
      }
    }
  }
}

const Basic = (props: BasicPropsWithTagName) => {
  const { prefixCls, className, children, tagName, ...others } = props;
  const classString = classNames(className, prefixCls)
  return React.createElement(tagName, { className: classString, ...others }, children);
}

interface BasicLayoutState {
  siders: string[];
}
class BasicLayout extends React.Component<BasicPropsWithTagName, BasicLayoutState> {
  state = { siders: [] };

  getSiderHook() {
    return {
      addSider: (id: string) => {
        this.setState(state => ({
          siders: [...state.siders, id]
        }))
      },
      removeSider: (id: string) => {
        this.setState(state => ({
          siders: state.siders.filter(currentId => currentId !== id)
        }))
      }
    }
  }
  render() {
    const { prefixCls, className, children, hasSider, tagName: Tag, ...others } = this.props;
    const classString = classNames(prefixCls, className, {
      [`${prefixCls}-has-sider`]
        : typeof hasSider === 'boolean' ? hasSider: this.state.siders.length > 0
    });
    return (
      <LayoutContext.Provider value={{ siderHook: this.getSiderHook()}}>
        <Tag className={classString} {...others}>
          { children }
        </Tag>
      </LayoutContext.Provider>
    );
  }
}
const Layout: React.ComponentClass<BasicProps> & {
  Header: React.ComponentClass<BasicProps>;
  Footer: React.ComponentClass<BasicProps>;
  Content: React.ComponentClass<BasicProps>;
  Sider: React.ComponentClass<SiderProps>;
} = generator({
  suffixCls: 'layout',
  tagName: 'section',
})(BasicLayout);

const Header = generator({
  suffixCls: 'layout-header',
  tagName: 'header'
})(Basic);

const Footer = generator({
  suffixCls: 'layout-footer',
  tagName: 'footer'
})(Basic);

const Content = generator({
  suffixCls: 'layout-content',
  tagName: 'main'
})(Basic);

Layout.Header = Header;
Layout.Footer = Footer;
Layout.Content = Content;

export default Layout;