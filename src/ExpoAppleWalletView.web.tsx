import * as React from 'react';

import { ExpoAppleWalletViewProps } from './ExpoAppleWallet.types';

export default function ExpoAppleWalletView(props: ExpoAppleWalletViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
