// Reexport the native module. On web, it will be resolved to ExpoAppleWalletModule.web.ts
// and on native platforms to ExpoAppleWalletModule.ts
export { default } from './ExpoAppleWalletModule';
export { default as ExpoAppleWalletView } from './ExpoAppleWalletView';
export * from  './ExpoAppleWallet.types';
