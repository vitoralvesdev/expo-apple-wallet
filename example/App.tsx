import ExpoReactNativeWalletModule from 'expo-apple-wallet';
import {SafeAreaView, ScrollView, Text, Platform, TouchableOpacity, View} from 'react-native';
import {useEffect, useState} from "react";

const isIos = Platform.OS === "ios"

export default function App() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [process, setProcess] = useState("");

  const panTokenSuffix = "3522"
  const holder = "DANIEL J C GOLFIERI"

  const initWallet = () => {
    console.log("init wallet", ExpoReactNativeWalletModule.isAvailable())
    setIsAvailable(ExpoReactNativeWalletModule.isAvailable())
  }

  const initEnrollProcess = () => {
    // console.log(ExpoReactNativeWalletModule.initEnrollProcess(panTokenSuffix, holder))
    // setProcess(ExpoReactNativeWalletModule.initEnrollProcess(panTokenSuffix, holder))
  }

  useEffect(() => {
    initWallet()
  }, [])

  const iosLayout = () => {
    return(
        <>
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
        </>
    )
  }

  const androidLayout = () => {
    return(
        <>
          <Group name="GoogleWalletAvailable:">
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
        </>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Expo Apple Wallet Example</Text>

        {isIos ? iosLayout() : null}
        {!isIos ? androidLayout() : null}
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
