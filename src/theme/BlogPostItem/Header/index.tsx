import React from 'react';
import BlogPostItemHeaderTitle from '@theme/BlogPostItem/Header/Title';
import BlogPostItemHeaderInfo from '@theme/BlogPostItem/Header/Info';
import BlogPostItemHeaderAuthors from '@theme/BlogPostItem/Header/Authors';
import CopyMarkdownButton from '@site/src/components/CopyMarkdownButton';

export default function BlogPostItemHeaderWrapper(): React.ReactElement {
  return (
    <header>
      <BlogPostItemHeaderTitle />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
        <BlogPostItemHeaderInfo />
        <CopyMarkdownButton />
      </div>
      <BlogPostItemHeaderAuthors />
    </header>
  );
}
