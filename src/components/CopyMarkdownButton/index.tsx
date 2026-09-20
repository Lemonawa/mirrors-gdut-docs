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
      className={clsx('button', 'button--sm', 'button--outline', styles.button)}
      onClick={handleClick}
      title="以 Markdown 格式复制整篇文章">
      {copied ? '✓ 已复制 Markdown' : '复制 Markdown'}
    </button>
  );
}
