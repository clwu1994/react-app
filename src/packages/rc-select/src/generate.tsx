import { Mode } from "./interface";

export interface RefSelectProps {
  focus(): void;
  blur(): void;
}

export interface selectProps<OptionsType extends object[]> extends React.AriaAttributes {
  prefixCls?: string;
  id?: string;
  className?: string;
  style?: React.CSSProperties;

  // options
  options?: OptionsType;
  children?: React.ReactNode;
  mode?: Mode;
}