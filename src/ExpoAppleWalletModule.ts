import { NativeModule, requireNativeModule } from 'expo';

// import { ExpoAppleWalletModuleEvents } from './ExpoAppleWallet.types';

declare class ExpoAppleWalletModule extends NativeModule { //<ExpoAppleWalletModuleEvents>
  isPassKitAvailable(): boolean;
  initEnrollProcess(panTokenSuffix: string, holder: string): string;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoAppleWalletModule>('ExpoAppleWallet');
