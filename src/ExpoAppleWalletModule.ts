import { requireNativeModule, EventEmitter } from 'expo-modules-core';

type NonceChangeEvent = {
  nonce: string;
  nonceSignature: string;
  certificates: string[];
};

type ExpoAppleWalletEvents = {
  onNonce: (event: NonceChangeEvent) => void;
};


const ExpoAppleWalletModule = requireNativeModule('ExpoAppleWallet');

const emitter = new EventEmitter<ExpoAppleWalletEvents>(ExpoAppleWalletModule);

export function addNonceListener(callback: (event: NonceChangeEvent) => void) {
  return emitter.addListener('onNonce', callback);
}

export default ExpoAppleWalletModule;
