import React, {useRef, useEffect} from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import {
  useMirrorLine,
} from '@site/src/hooks/useMirrorDomain';
import {MIRROR_LINES} from '@site/src/utils/mirrorDomain';
import styles from './styles.module.css';

export default function MirrorLineDropdownNavbarItem({
  mobile = false,
}: {
  mobile?: boolean;
  [key: string]: unknown;
}): ReactNode {
  const [line, setLine] = useMirrorLine();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileSidebar = useNavbarMobileSidebar();

  useEffect(() => {
    if (mobile) return;
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        dropdownRef.current?.classList.remove(styles.open);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [mobile]);

  if (mobile || mobileSidebar?.shouldRender) {
    return null;
  }

  const current =
    MIRROR_LINES.find((l) => l.key === line) ?? MIRROR_LINES[0];
  if (!current) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className={clsx('navbar__item', 'dropdown', 'dropdown--right', 'dropdown--hoverable', styles.container)}
      data-mirror-line={line}>
      <button type="button" className={clsx('navbar__link', styles.button)} aria-haspopup="true">
        <span className={styles.label}>线路选择:</span> {current.label}
      </button>
      <ul className="dropdown__menu">
        {MIRROR_LINES.map((l) => (
          <li key={l.key}>
            <button
              type="button"
              className={clsx('dropdown__link', styles.option, l.key === line && styles.active)}
              onClick={() => setLine(l.key)}>
              <span className={styles.optionHeader}>
                {l.key === line && <span className={styles.check}>✓</span>}
                {l.label}
              </span>
              <span className={styles.domain}>{l.domain}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
