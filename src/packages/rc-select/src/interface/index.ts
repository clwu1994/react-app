import * as React from 'react';
import { Key } from './generator';

export type Mode = 'multiple' | 'tags' | 'combobox';
// ======================== Option ========================
export interface OptionCoreData {
  key?: Key;
  disabled?: boolean;
  value: Key;
  title?: string;
  className?: string;
  
}