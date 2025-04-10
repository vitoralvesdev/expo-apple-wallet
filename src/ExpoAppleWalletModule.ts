import { NativeModule, requireNativeModule } from 'expo';

type NonceChangeEvent = {
  nonce: string;
  nonceSignature: string
};

type NonceModuleEvents = {
  onNonce(event: NonceChangeEvent[]): void;
};

declare class ExpoAppleWalletModule extends NativeModule<NonceModuleEvents> {
  isAvailable(): Promise<boolean>;
  initEnrollProcess(panTokenSuffix: string, holder: string): Promise<string>;
}

const module = requireNativeModule<ExpoAppleWalletModule>('ExpoAppleWallet');

module.addListener('onNonce', (event: NonceChangeEvent[]) => {});

export default module;