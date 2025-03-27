import ExpoModulesCore
import PassKit

private struct Card {
    /// Last four digits of the `pan token` numeration for the card (****-****-****-0000)
    let panTokenSuffix: String
    /// Holder for the card
    let holder: String
}

/**
 Define if PassKit will be available for this device
 */
private func isPassKitAvailable() -> Bool {
    return PKAddPaymentPassViewController.canAddPaymentPass()
}

/**
 Return the card information that Apple will display into enrollment screen
 */
private func cardInformation(panTokenSuffix: String, holder: String) -> Card {
    return Card(panTokenSuffix: panTokenSuffix, holder: holder)
}

/**
 Init enrollment process
*/
private class handleDelegate: NSObject, PKAddPaymentPassViewControllerDelegate {
    private let configuration: PKAddPaymentPassRequestConfiguration

    init(configuration: PKAddPaymentPassRequestConfiguration) {
        self.configuration = configuration
    }

    func addPaymentPassViewController(
        _ controller: PKAddPaymentPassViewController,
        generateRequestWithCertificateChain certificates: [Data],
        nonce: Data, nonceSignature: Data,
        completionHandler handler: @escaping (PKAddPaymentPassRequest) -> Void) {

        // Perform the bridge from Apple -> Issuer -> Apple
    }

    func addPaymentPassViewController(
        _ controller: PKAddPaymentPassViewController,
        didFinishAdding pass: PKPaymentPass?,
        error: Error?) {

        // This method will be called when enroll process ends (with success / error)
    }

    func createEnrollViewController() -> PKAddPaymentPassViewController? {
        return PKAddPaymentPassViewController(requestConfiguration: configuration, delegate: self)
    }
}

public class ExpoReactNativeWalletModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoReactNativeWallet")

    Function("isAvailable") { () -> Bool in
        return isPassKitAvailable()
    }

    Function("initEnrollProcess") { (panTokenSuffix: String, holder: String) -> String in
      let card = cardInformation(panTokenSuffix: panTokenSuffix, holder: holder)

      guard let configuration = PKAddPaymentPassRequestConfiguration(encryptionScheme: .ECC_V2) else {
          return "Falha ao criar a configuração do cartão"
      }

      configuration.cardholderName = card.holder
      configuration.primaryAccountSuffix = card.panTokenSuffix
      configuration.paymentNetwork = PKPaymentNetwork.visa

      let delegate = handleDelegate(configuration: configuration)

      if !PKAddPaymentPassViewController.canAddPaymentPass() {
          return "PassKit não está disponível neste dispositivo"
      }

      guard let enrollViewController = delegate.createEnrollViewController() else {
          let error = NSError(domain: "ExpoReactNativeWalletModule", code: 0, userInfo: [
              NSLocalizedDescriptionKey: "Falha ao criar o controlador de inscrição no InApp \(configuration)",
              "Configuração": "\(configuration)"
          ])
          print("Erro ao criar PKAddPaymentPassViewController:", error)
          return error.localizedDescription
      }

      return "Configuração do cartão carregado com sucesso, \(configuration)"
   }
  }
}
