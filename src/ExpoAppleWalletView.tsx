import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoAppleWalletViewProps } from './ExpoAppleWallet.types';

const NativeView: React.ComponentType<ExpoAppleWalletViewProps> =
  requireNativeView('ExpoAppleWallet');

export default function ExpoAppleWalletView(props: ExpoAppleWalletViewProps) {
  return <NativeView {...props} />;
}
