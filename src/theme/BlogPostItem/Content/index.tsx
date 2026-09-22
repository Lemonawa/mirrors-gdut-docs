import React from 'react';
import type {ReactNode} from 'react';
import MDXContent from '@theme/MDXContent';
import CopyMarkdownButton from '@site/src/components/CopyMarkdownButton';

export default function BlogPostItemContentWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): React.ReactElement {
  return (
    <div
      className="copy-markdown-anchor"
      style={{position: 'relative'}}>
      <CopyMarkdownButton />
      <div className={className}>
        <MDXContent>{children}</MDXContent>
      </div>
    </div>
  );
}
