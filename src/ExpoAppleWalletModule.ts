import { requireNativeModule, EventEmitter } from 'expo-modules-core';

type appToAppChangeEvent = {
  nonce: string;
  nonceSignature: string;
};

type ExpoAppleWalletEvents = {
  appToApp: (event: appToAppChangeEvent) => void;
};


const ExpoAppleWalletModule = requireNativeModule('ExpoAppleWallet');

const emitter = new EventEmitter<ExpoAppleWalletEvents>(ExpoAppleWalletModule);

export function addAppToAppListener(callback: (event: appToAppChangeEvent) => void) {
  return emitter.addListener('appToApp', callback);
}

export default ExpoAppleWalletModule;
