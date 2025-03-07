import { registerWebModule, NativeModule } from 'expo';

import { ExpoAppleWalletModuleEvents } from './ExpoAppleWallet.types';

class ExpoAppleWalletModule extends NativeModule<ExpoAppleWalletModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoAppleWalletModule);
