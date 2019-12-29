import * as React from 'react'
import createReactContext from '@ant-design/create-react-context';

export interface CSPConfig {
  nonce?: string;
}

export interface ConfigConsumerProps {
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  rootPrefixCls?: string;
  getPrefixCls: (suffixCls: string, customizePrefixCls?: string) => string;
  // renderEmpty: RenderEmptyHandler;
  csp?: CSPConfig;
  autoInsertSpaceInButton?: boolean;
  // locale?: Locale;
  pageHeader?: {
    ghost: boolean;
  }
}

export const ConfigContext = createReactContext<ConfigConsumerProps>({
  getPrefixCls: (suffixCls: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls;
    return `ant-${suffixCls}`;
  },
  // renderEmpty: defaultRenderEmpty
})
export const ConfigConsumer = ConfigContext.Consumer;

type IReactComponent<P = any> =
  | React.StatelessComponent<P>
  | React.ComponentClass<P>
  | React.ClassicComponentClass<P>;

  
interface BasicExportProps {
  prefixCls?: string;
}

interface ConsumerConfig {
  prefixCls: string;
}

interface ConstructorProps {
  displayName?: string;
}

export function withConfigConsumer<ExportProps extends BasicExportProps>(config: ConsumerConfig) {
  return function withConfigConsumerFunc<ComponentDef>(
    Component: IReactComponent
  ): React.SFC<ExportProps> & ComponentDef {
    //用ConfigConsumer包装。由于我们需要与react 15兼容，因此在使用ref方法时要格外小心
    const SFC = ((props: ExportProps) => (
      <ConfigConsumer>
        {(configProps: ConfigConsumerProps) => {
          const { prefixCls: basicPrefixCls } = config;
          const { getPrefixCls } = configProps;
          const { prefixCls: customizePrefixCls } = props;
          const prefixCls = getPrefixCls(basicPrefixCls, customizePrefixCls);
          return <Component {...configProps} {...props} prefixCls={prefixCls} />;
        }}
      </ConfigConsumer>
    )) as React.SFC<ExportProps> & ComponentDef;
    const cons: ConstructorProps = Component.constructor as ConstructorProps
    const name = (cons && cons.displayName) || Component.name || 'Component';
    SFC.displayName = `withConfigConsumer(${name})`;
    return SFC;
  }
}