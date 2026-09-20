import React from 'react';
import type {ReactNode} from 'react';
import CopyMarkdownButton from '@site/src/components/CopyMarkdownButton';

export default function DocItemContentWrapper({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <>
      <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem'}}>
        <CopyMarkdownButton />
      </div>
      {children}
    </>
  );
}
