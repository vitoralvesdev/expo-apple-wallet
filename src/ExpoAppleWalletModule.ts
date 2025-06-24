import { requireNativeModule } from 'expo-modules-core'; //EventEmitter

// type appToAppChangeEvent = {
//   nonce: string;
//   nonceSignature: string;
// };

// type ExpoAppleWalletEvents = {
//   appToApp: (event: appToAppChangeEvent) => void;
// };

// const emitter = new EventEmitter<ExpoAppleWalletEvents>(ExpoAppleWalletModule);
//
// export function addAppToAppListener(callback: (event: appToAppChangeEvent) => void) {
//   return emitter.addListener('appToApp', callback);
// }

const ExpoAppleWalletModule = requireNativeModule('ExpoAppleWallet');

export default ExpoAppleWalletModule;
