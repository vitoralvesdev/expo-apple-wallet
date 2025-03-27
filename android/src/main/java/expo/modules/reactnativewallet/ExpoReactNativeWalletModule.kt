package expo.modules.reactnativewallet

import android.util.Log
import android.app.Activity
import android.content.Context
import com.google.android.gms.tasks.Tasks
import com.google.android.gms.wallet.PaymentsClient
import com.google.android.gms.wallet.Wallet
import com.google.android.gms.wallet.Wallet.WalletOptions
import com.google.android.gms.wallet.IsReadyToPayRequest
import org.json.JSONObject
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoReactNativeWalletModule : Module() {
    private val context
      get() = requireNotNull(appContext.reactContext)
    private var paymentsClient: PaymentsClient? = null

    private fun checkIfWalletIsAvailable(): Boolean {
        val request = IsReadyToPayRequest.fromJson(JSONObject().toString())
        val task = paymentsClient?.isReadyToPay(request) ?: return false

        return try {
           val result = Tasks.await(task)
           Log.d("WalletModule", "isReadyToPay result: $result")
           result == true
        } catch (e: Exception) {
            Log.e("WalletModule", "Erro ao verificar isReadyToPay", e)
            false
        }
    }

    fun initializeWallet(context: Context) {
        paymentsClient = Wallet.getPaymentsClient(
            context,
            WalletOptions.Builder()
                .setEnvironment(1)
                .build()
        )
    }

    override fun definition() = ModuleDefinition {
        Name("ExpoReactNativeWallet")

        Function("isAvailable") {
            initializeWallet(context ?: return@Function false)

            return@Function checkIfWalletIsAvailable()
        }
    }
}
