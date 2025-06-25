import ExpoModulesCore
import UIKit
import PassKit

private struct Card {
    let panTokenSuffix: String
    let holder: String
}

private struct NonceResult {
    let nonce: String
    let nonceSignature: String
    let certificates: [String]
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
    private var nonceContinuation: CheckedContinuation<NonceResult, Error>?

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
        let certificatesBase64 = certificates.map { $0.base64EncodedString() }

        if let continuation = self.nonceContinuation {
            continuation.resume(returning: NonceResult(
                nonce: nonceBase64,
                nonceSignature: nonceSignatureBase64,
                certificates: certificatesBase64
            ))
            self.nonceContinuation = nil
        } else {
            print("Nenhuma continuation esperando pelo nonce")
        }
    }

    func addPaymentPassViewController(
        _ controller: PKAddPaymentPassViewController,
        didFinishAdding pass: PKPaymentPass?,
        error: Error?
    ) {
        if let error = error {
            print("Erro ao adicionar cartão: \(error.localizedDescription)")
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

    func waitForNonce() async throws -> NonceResult {
        return try await withCheckedThrowingContinuation { continuation in
            self.nonceContinuation = continuation
        }
    }
}

public class ExpoAppleWalletModule: Module {
    private var activeDelegate: HandleDelegate?

    public func definition() -> ModuleDefinition {
        Name("ExpoAppleWallet")

        Events("appToApp")

        Function("isAvailable") { () -> Bool in
            return isPassKitAvailable()
        }

        AsyncFunction("isCardAlreadyAdded") { (panTokenSuffix: String) -> Bool in
            let passLibrary = PKPassLibrary()
            let passes = passLibrary.passes()

            for pass in passes {
                if let paymentPass = pass as? PKPaymentPass {
                    if paymentPass.primaryAccountNumberSuffix == panTokenSuffix {
                        return true
                    }
                }
            }

            return false
        }

        AsyncFunction("initEnrollProcess") { (panTokenSuffix: String, holder: String) async throws -> [String: String] in
            let card = cardInformation(panTokenSuffix: panTokenSuffix, holder: holder)

            guard let configuration = PKAddPaymentPassRequestConfiguration(encryptionScheme: .ECC_V2) else {
                throw NSError(domain: "Configuração inválida", code: 0)
            }

            configuration.cardholderName = card.holder
            configuration.primaryAccountSuffix = card.panTokenSuffix
            configuration.paymentNetwork = PKPaymentNetwork.visa

            let delegate = HandleDelegate(configuration: configuration, module: self)
            self.activeDelegate = delegate

            if await !PKAddPaymentPassViewController.canAddPaymentPass() {
                throw NSError(domain: "PassKit indisponível", code: 0)
            }

            guard let enrollViewController = delegate.createEnrollViewController() else {
                throw NSError(domain: "Erro ao criar controlador", code: 0)
            }

            guard let currentVC = appContext?.utilities?.currentViewController() else {
                throw NSError(domain: "Sem controlador atual", code: 0)
            }

            DispatchQueue.main.async {
                currentVC.present(enrollViewController, animated: true, completion: nil)
            }

            let result = try await delegate.waitForNonce()

            return [
                "nonce": result.nonce,
                "nonceSignature": result.nonceSignature,
                "certificates": result.certificates.joined(separator: ",")
            ]
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
