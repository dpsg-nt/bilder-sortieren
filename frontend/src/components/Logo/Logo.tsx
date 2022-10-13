import * as React from 'react';

import { ReactComponent as LogoSvg } from './Logo.svg';

export const Logo: React.FC<{ className?: string }> = (props) => {
  return <LogoSvg style={{ height: '100%' }} className={props.className} />;
};
