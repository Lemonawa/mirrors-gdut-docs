import {useEffect, useState, useCallback} from 'react';
import {
  MIRROR_DOMAIN_EVENT,
  applyMirrorDomainToText,
  getMirrorLine,
  type MirrorLine,
} from '@site/src/utils/mirrorDomain';

function applyToCodeBlocks(line: MirrorLine): void {
  const blocks = document.querySelectorAll('pre, code');
  blocks.forEach((block) => {
    if (block.dataset.mirrorLine === line) return;
    if (!block.textContent?.includes('mirrors')) return;
    const walker = document.createTreeWalker(
      block,
      NodeFilter.SHOW_TEXT,
    );
    let node = walker.nextNode();
    while (node) {
      if (node.textContent?.includes('mirrors')) {
        node.textContent = applyMirrorDomainToText(node.textContent, line);
      }
      node = walker.nextNode();
    }
    block.dataset.mirrorLine = line;
  });
}

function useMirrorLineInternal(): [MirrorLine, (line: MirrorLine) => void] {
  const [line, setLine] = useState<MirrorLine>('auto');

  useEffect(() => {
    setLine(getMirrorLine());
    const handler = (e: Event) => {
      const next = (e as CustomEvent).detail?.line as MirrorLine;
      if (next) setLine(next);
    };
    window.addEventListener(MIRROR_DOMAIN_EVENT, handler);
    return () => window.removeEventListener(MIRROR_DOMAIN_EVENT, handler);
  }, []);

  return [line, setLine];
}

export function useMirrorLine(): [MirrorLine, (line: MirrorLine) => void] {
  const [line, setLineState] = useMirrorLineInternal();

  const setLine = useCallback(
    (next: MirrorLine) => {
      import('@site/src/utils/mirrorDomain').then(({setMirrorLine}) => {
        setMirrorLine(next);
      });
    },
    [],
  );

  return [line, setLine];
}

export function useMirrorLineValue(): MirrorLine {
  const [line] = useMirrorLineInternal();
  return line;
}

export function useMirrorLineEffect(): MirrorLine {
  const [line] = useMirrorLineInternal();

  useEffect(() => {
    applyToCodeBlocks(line);

    const observer = new MutationObserver(() => {
      applyToCodeBlocks(getMirrorLine());
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [line]);

  return line;
}
