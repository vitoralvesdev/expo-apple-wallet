import ExpoAppleWalletModule from 'expo-apple-wallet';
import {SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useEffect, useState} from "react";

export default function App() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [process, setProcess] = useState("");

  const panTokenSuffix = "3522"
  const holder = "DANIEL J C GOLFIERI"

  const initWallet = async () => {
    const _isAvailable = await ExpoAppleWalletModule.isAvailable()

    console.log("init wallet", _isAvailable)

    setIsAvailable(_isAvailable)
  }

  const initEnrollProcess = () => {
    // console.log(ExpoReactNativeWalletModule.initEnrollProcess(panTokenSuffix, holder))
    // setProcess(ExpoReactNativeWalletModule.initEnrollProcess(panTokenSuffix, holder))
  }

  useEffect(() => {
    initWallet().then()
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
                    onPress={initEnrollProcess}
                >
                  <Text style={{
                    color: "#FFF",
                    textAlign: "center"
                  }}>Iniciar configuração</Text>
                </TouchableOpacity>

                <Text style={{
                  color: "grey",
                  fontWeight: "bold",
                  padding: 10
                }}>{process}</Text>
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
