import {SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useEffect, useState} from "react";
import ExpoAppleWalletModule from 'expo-apple-wallet';

export default function App() {
  const [isAvailable, setIsAvailable] = useState(false)

  const panTokenSuffix = "1234"
  const holder = "YOUR NAME"

  const init = async () => {
    setIsAvailable(await ExpoAppleWalletModule.isAvailable())
  }

  const call = async () => {
    const response = await ExpoAppleWalletModule.initEnrollProcess(panTokenSuffix, holder)

    if (response) {
      const {nonce, nonceSignature, certificates} = response

      console.log(nonce, nonceSignature, certificates)

      // call your back-end

      const activationData = "param1"
      const encryptedPassData = "param2"
      const ephemeralPublicKey = "param3"

      await ExpoAppleWalletModule.completeEnrollment(
          activationData,
          encryptedPassData,
          ephemeralPublicKey,
      )
    }
  }

  useEffect(() => {
    init().then()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Expo Apple Wallet Example</Text>

        <Group name="PassKitAvailable:">
          { !isAvailable ?
              (<Text style={{
                color: "red",
                fontWeight: "bold"
              }}>Indisponível</Text>)
              : (<Text style={{
                color: "green",
                fontWeight: "bold"
              }}>Disponível</Text>)
          }
        </Group>

        <Group name="initEnrollProcess">
          {isAvailable ? (
              <>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={{
                      borderRadius: 10,
                      backgroundColor: "#000",
                      padding: 10
                    }}
                    onPress={call}
                >
                  <Text style={{
                    color: "#FFF",
                    textAlign: "center"
                  }}>Adicionar ao Apple Wallet</Text>
                </TouchableOpacity>
              </>
          ) : (
              <Text style={{
                color: "red",
                fontWeight: "bold",
              }}>PassKit Indisponível</Text>
          )}
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  view: {
    flex: 1,
    height: 200,
  },
};
