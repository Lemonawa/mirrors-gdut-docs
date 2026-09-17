export type MirrorLine = 'auto' | 'ipv4' | 'ipv6';

export const MIRROR_DOMAIN_STORAGE_KEY = 'mirror-domain';

export const MIRROR_LINES: {key: MirrorLine; label: string; domain: string}[] = [
  {key: 'auto', label: '自动选择', domain: 'mirrors.gdut.edu.cn'},
  {key: 'ipv4', label: 'IPv4 线路', domain: 'mirrors4.gdut.edu.cn'},
  {key: 'ipv6', label: 'IPv6 线路', domain: 'mirrors6.gdut.edu.cn'},
];

export const MIRROR_DOMAIN_EVENT = 'mirror-domain-change';

export function getMirrorLine(): MirrorLine {
  if (typeof window === 'undefined') return 'auto';
  const stored = window.localStorage.getItem(MIRROR_DOMAIN_STORAGE_KEY);
  if (stored === 'ipv4' || stored === 'ipv6' || stored === 'auto') {
    return stored;
  }
  return 'auto';
}

export function setMirrorLine(line: MirrorLine): void {
  window.localStorage.setItem(MIRROR_DOMAIN_STORAGE_KEY, line);
  window.dispatchEvent(
    new CustomEvent(MIRROR_DOMAIN_EVENT, {detail: {line}}),
  );
}

export function getMirrorDomain(line?: MirrorLine): string {
  const active = line ?? getMirrorLine();
  return (
    MIRROR_LINES.find((l) => l.key === active)?.domain ??
    'mirrors.gdut.edu.cn'
  );
}

export function applyMirrorDomain(host: string, line?: MirrorLine): string {
  const domain = getMirrorDomain(line);
  return host.replace(/mirrors(\d)?\.gdut\.edu\.cn/g, domain);
}

export function applyMirrorDomainToText(text: string, line?: MirrorLine): string {
  const domain = getMirrorDomain(line);
  return text.replace(/mirrors(?:\d)?\.gdut\.edu\.cn/g, domain);
}
