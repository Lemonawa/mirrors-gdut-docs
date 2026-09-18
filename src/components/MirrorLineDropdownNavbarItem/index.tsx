import React from 'react';
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
  const mobileSidebar = useNavbarMobileSidebar();

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
      className={clsx('navbar__item', styles.container)}
      data-mirror-line={line}>
      <span className={clsx('navbar__link', styles.label)}>线路选择:</span>
      <div className={clsx('dropdown', 'dropdown--right', styles.dropdown)}>
        <button
          type="button"
          className={clsx(styles.button)}
          aria-haspopup="true">
          {current.label}
        </button>
        <ul className="dropdown__menu">
          {MIRROR_LINES.map((l) => (
            <li key={l.key}>
              <button
                type="button"
                className={clsx('dropdown__link', styles.option, l.key === line && styles.active)}
                onClick={() => setLine(l.key)}>
                <span className={styles.optionHeader}>
                  <span>{l.label}</span>
                  {l.key === line && <span className={styles.check}>✓</span>}
                </span>
                <span className={styles.domain}>{l.domain}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
