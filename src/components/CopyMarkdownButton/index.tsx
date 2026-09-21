import React, {useCallback, useState} from 'react';
import clsx from 'clsx';
import {htmlToMarkdown} from '@site/src/utils/htmlToMarkdown';
import styles from './styles.module.css';

export default function CopyMarkdownButton(): React.ReactElement {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(async () => {
    const article = document.querySelector('article');
    if (!article) return;
    const clone = article.cloneNode(true) as HTMLElement;
    clone.querySelector('nav[aria-label="Breadcrumbs"]')?.remove();
    clone
      .querySelector('[class*="breadcrumbsContainer"]')
      ?.remove();
    clone
      .querySelectorAll(
        'button, [class*="tocCollapsible"], [class*="theme-edit-this-page"], a[href*="/edit/master"]',
      )
      .forEach((el) => el.remove());
    const markdown = htmlToMarkdown(clone.innerHTML);
    try {
      await navigator.clipboard.writeText(markdown);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = markdown;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <button
      type="button"
      className={clsx(styles.button, copied && styles.copied)}
      onClick={handleClick}
      title="以 Markdown 格式复制整篇文章">
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true">
        {copied ? (
          <>
            <rect width="14" height="14" x="8" y="8" rx="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            <path d="m12 15 2 2 4-4" />
          </>
        ) : (
          <>
            <rect width="14" height="14" x="8" y="8" rx="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </>
        )}
      </svg>
      <span>{copied ? '已复制 Markdown' : '复制 Markdown'}</span>
    </button>
  );
}
