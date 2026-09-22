import TurndownService from 'turndown';
import {gfm} from 'turndown-plugin-gfm';

function escapeHtmlEntities(text: string): string {
  return text;
}

function addAdmonitionRule(turndown: TurndownService): void {
  turndown.addRule('admonition', {
    filter: (node) => {
      if (node.nodeType !== 1) return false;
      const el = node as HTMLElement;
      return (
        el.tagName === 'ADMONITION' ||
        el.classList.contains('admonition') ||
        el.classList.contains('theme-admonition')
      );
    },
    replacement: (_content, node) => {
      const el = node as HTMLElement;
      const titleAttr = el.getAttribute('title');
      const titleEl =
        el.querySelector('.admonition-title') ??
        el.querySelector('[class*="admonitionTitle"]') ??
        el.querySelector('[class*="admonitionHeading"]');
      const titleText =
        titleAttr ?? titleEl?.textContent?.trim() ?? 'Note';
      const body = el.cloneNode(true) as HTMLElement;
      body
        .querySelectorAll(
          '.admonition-title, [class*="admonitionTitle"], [class*="admonitionHeading"]',
        )
        .forEach((n) => n.remove());
      body.removeAttribute('title');
      const inner = turndown.turndown(body.innerHTML);
      return `\n\n> **${titleText}**\n>\n${inner
        .split('\n')
        .map((l) => (l ? `> ${l}` : '>'))
        .join('\n')}\n\n`;
    },
  });
}

function addTabsRule(turndown: TurndownService): void {
  turndown.addRule('tabs', {
    filter: (node) => {
      return (
        node.nodeType === 1 &&
        (node as HTMLElement).getAttribute('role') === 'tablist'
      );
    },
    replacement: () => '',
  });
}

function addCodeBlockRule(turndown: TurndownService): void {
  turndown.addRule('fencedCodeBlock', {
    filter: (node) => {
      return (
        node.nodeType === 1 &&
        node.nodeName === 'PRE' &&
        !node.firstChild?.nodeName
      );
    },
    replacement: (_content, node) => {
      const el = node as HTMLElement;
      const codeEl = el.querySelector('code');
      const className = codeEl?.className ?? '';
      const langMatch = className.match(/language-(\w+)/);
      const lang = langMatch ? langMatch[1] : '';
      const code = codeEl?.textContent ?? el.textContent ?? '';
      return `\n\n\`\`\`${lang}\n${code.replace(/\n$/, '')}\n\`\`\`\n\n`;
    },
  });
}

function setupTurndown(): TurndownService {
  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '*',
  });
  turndown.remove(['script', 'style', 'button']);
  turndown.use(gfm);
  addAdmonitionRule(turndown);
  addTabsRule(turndown);
  addCodeBlockRule(turndown);
  return turndown;
}

let cached: TurndownService | null = null;

export function htmlToMarkdown(html: string): string {
  if (!cached) {
    cached = setupTurndown();
  }
  return cached.turndown(html).replace(/\n{3,}/g, '\n\n').trim();
}
