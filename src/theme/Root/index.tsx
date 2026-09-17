import React from 'react';
import Root from '@theme-original/Root';
import {useMirrorLineEffect} from '@site/src/hooks/useMirrorDomain';

export default function RootWrapper(props: Parameters<typeof Root>[0]) {
  useMirrorLineEffect();
  return <Root {...props} />;
}
