import React from 'react';
import type {ReactNode} from 'react';
import CopyMarkdownButton from '@site/src/components/CopyMarkdownButton';

export default function DocItemContentWrapper({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <div
      className="copy-markdown-anchor"
      style={{position: 'relative'}}>
      <CopyMarkdownButton />
      {children}
    </div>
  );
}
