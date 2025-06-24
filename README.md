# expo-apple-wallet (perfect for managed Expo projects)

### Add the package to your project dependencies

```
npm install react-native-expo-apple-wallet
```

or

```
yarn add react-native-expo-apple-wallet
```


## 1. Settings in Apple Developer panel
#### Within your identifier settings

### Add capabilities

![Logo da Minha Empresa](/assets/wallet.png)
![Logo da Minha Empresa](/assets/provisioning.png)
####  1.1 You need to send an e-mail to Apple asking for the release of capability "In-App Provisioning" in the panel.
####  1.2 Create a profile of type "App Store Provisioning Profile"

## 2. Adding capabilities in the project
#### In your app.config.js file add this entitlements configs

````
ios: {
    entitlements: {
        "com.apple.developer.payment-pass-provisioning": true,
        "com.apple.developer.pass-type-identifiers": ["$(TeamIdentifierPrefix)*"],
      },
},
