import * as React from 'react';
import { ConfigConsumer, ConfigContext, CSPConfig, ConfigConsumerProps as IConfigConsumerProps } from './context';
export { ConfigConsumer };
export type ConfigConsumerProps = IConfigConsumerProps;
export const configProviderProps = []

export interface ConfigProviderProps {
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  prefixCls?: string;
  children?: React.ReactNode;
  // renderEmpty?: RenderEmptyHandler;
  csp?: CSPConfig;
  autoInsertSpaceInButton?: boolean;
  // locale?: Locale;
  pageHeader?: {
    ghost: boolean;
  };
}

// class ConfigProvider extends React.Component<ConfigProviderProps> {
//   getPrefixCls = (suffixCls: string, customizePrefixCls?: string) => {
//     const { prefixCls = 'ant' } = this.props;
//     if (customizePrefixCls) return customizePrefixCls;
//     return suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls;
//   }
//   renderProvider = (context: ConfigConsumerProps, legacyLocale: any) => {
//     const {
//       children,
//       getPopupContainer,
//       // renderEmpty,
//       csp,
//       autoInsertSpaceInButton,
//       // locale,
//       pageHeader,
//     } = this.props;

//     const config: ConfigConsumerProps = {
//       ...context,
//       getPrefixCls: this.getPrefixCls,
//       csp,
//       autoInsertSpaceInButton
//     }

//     if (getPopupContainer) {
//       config.getPopupContainer = getPopupContainer;
//     }

//     // if (renderEmpty) {
//     //   config.renderEmpty = renderEmpty;
//     // }

//     if (pageHeader) {
//       config.pageHeader = pageHeader;
//     }
//     return (
//       <ConfigContext.Provider>
//         <LocaleProvider locale={locale || legacyLocale} _ANT_MARK__={ANT_MARK}>
//           {children}
//         </LocaleProvider>
//       </ConfigContext.Provider>
//     )
//   }
// }