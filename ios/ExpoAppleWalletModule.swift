import ExpoModulesCore
import UIKit
import PassKit

private struct Card {
    let panTokenSuffix: String
    let holder: String
}

private func isPassKitAvailable() -> Bool {
    return PKAddPaymentPassViewController.canAddPaymentPass()
}

private func cardInformation(panTokenSuffix: String, holder: String) -> Card {
    return Card(panTokenSuffix: panTokenSuffix, holder: holder)
}

private class HandleDelegate: NSObject, PKAddPaymentPassViewControllerDelegate {
    private let configuration: PKAddPaymentPassRequestConfiguration
    private unowned let module: ExpoAppleWalletModule
    private var completionHandler: ((PKAddPaymentPassRequest) -> Void)?

    init(configuration: PKAddPaymentPassRequestConfiguration, module: ExpoAppleWalletModule) {
        self.configuration = configuration
        self.module = module
    }

    func addPaymentPassViewController(
        _ controller: PKAddPaymentPassViewController,
        generateRequestWithCertificateChain certificates: [Data],
        nonce: Data, nonceSignature: Data,
        completionHandler handler: @escaping (PKAddPaymentPassRequest) -> Void
    ) {
        self.completionHandler = handler

        let nonceBase64 = nonce.base64EncodedString()
        let nonceSignatureBase64 = nonceSignature.base64EncodedString()

        module.sendEvent("onNonce", [
            "nonce": nonceBase64,
            "nonceSignature": nonceSignatureBase64
        ])
    }

    func addPaymentPassViewController(
        _ controller: PKAddPaymentPassViewController,
        didFinishAdding pass: PKPaymentPass?,
        error: Error?
    ) {
        if let error = error {
            print("Erro ao adicionar o cartão: \(error.localizedDescription)")
        } else {
            print("Cartão adicionado com sucesso!")
        }

        DispatchQueue.main.async {
            controller.dismiss(animated: true, completion: nil)
        }
    }

    func createEnrollViewController() -> PKAddPaymentPassViewController? {
        return PKAddPaymentPassViewController(requestConfiguration: configuration, delegate: self)
    }

    func continueEnrollment(
            activationData: Data,
            ephemeralPublicKey: Data,
            encryptedPassData: Data
        ) {
        guard let handler = self.completionHandler else {
            print("Handler não encontrado")
            return
        }

        let request = PKAddPaymentPassRequest()

        request.activationData = activationData
        request.ephemeralPublicKey = ephemeralPublicKey
        request.encryptedPassData = encryptedPassData

        handler(request)

        self.completionHandler = nil
    }
}

public class ExpoAppleWalletModule: Module {
    private var activeDelegate: HandleDelegate?

    public func definition() -> ModuleDefinition {
        Name("ExpoAppleWallet")

        Events("onNonce")

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

            let delegate = HandleDelegate(configuration: configuration, module: self)

            self.activeDelegate = delegate

            if !PKAddPaymentPassViewController.canAddPaymentPass() {
                return "PassKit não está disponível neste dispositivo"
            }

            guard let enrollViewController = delegate.createEnrollViewController() else {
                return "Falha ao criar o controlador de inscrição no InApp"
            }

            guard let currentVC = appContext?.utilities?.currentViewController() else {
                return "Não foi possível obter o controlador de visualização atual"
            }

            DispatchQueue.main.async {
                currentVC.present(enrollViewController, animated: true, completion: nil)
            }

            return "Processo de inscrição iniciado"
        }

        Function("completeEnrollment") {
            (
                activationDataBase64: String,
                ephemeralPublicKeyBase64: String,
                encryptedPassDataBase64: String
            ) in

            guard let delegate = self.activeDelegate else {
                print("Delegate não encontrado")
                return
            }

            guard let activationData = Data(base64Encoded: activationDataBase64),
                  let ephemeralPublicKey = Data(base64Encoded: ephemeralPublicKeyBase64),
                  let encryptedPassData = Data(base64Encoded: encryptedPassDataBase64) else {
                print("Dados inválidos")
                return
            }

            delegate.continueEnrollment(
                activationData: activationData,
                ephemeralPublicKey: ephemeralPublicKey,
                encryptedPassData: encryptedPassData
            )
        }
    }
}
