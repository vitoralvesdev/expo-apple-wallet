import { NativeModule, requireNativeModule } from 'expo';

declare class ExpoReactNativeWalletModule extends NativeModule {
  isAvailable(): boolean;
  // initEnrollProcess(panTokenSuffix: string, holder: string): string;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoReactNativeWalletModule>('ExpoReactNativeWallet');
