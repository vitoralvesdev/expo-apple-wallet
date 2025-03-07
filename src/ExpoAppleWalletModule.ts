import { NativeModule, requireNativeModule } from 'expo';

import { ExpoAppleWalletModuleEvents } from './ExpoAppleWallet.types';

declare class ExpoAppleWalletModule extends NativeModule<ExpoAppleWalletModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoAppleWalletModule>('ExpoAppleWallet');
