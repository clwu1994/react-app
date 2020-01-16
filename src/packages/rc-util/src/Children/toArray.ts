import React from 'react';

export default function toArray(children: React.ReactNode): React.ReactElement[]  {
  const ret: any[] = [];
  React.Children.forEach(children, C => {
    ret.push(C);
  });
  return ret;
}