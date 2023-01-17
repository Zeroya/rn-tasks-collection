import React, { useState } from "react";
import { ImageBackground, StyleSheet, Text, View, TouchableHighlight, SafeAreaView, Linking } from "react-native";
import { Button } from "@rneui/themed";
import { BarCodeScanner } from "expo-barcode-scanner";
import Header from "../components/Header";

export default function QrScanner({ navigation }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    navigation.navigate("Map", { paramKey: data });
    // Linking.openURL(data);
    setHasPermission(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/qrContainerCover.png")}
        style={styles.backgroundImage}
        imageStyle={{
          resizeMode: "cover",
        }}
      >
        <Header navigation={navigation} />
        <View style={styles.countdown}>
          {hasPermission ? (
            <>
              <BarCodeScanner
                style={styles.scannedForm}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              />
              <View style={styles.buttonsBlock}>
                <Button
                  buttonStyle={styles.backButton}
                  onPress={() => {
                    setHasPermission(false);
                  }}
                  size="sm"
                >
                  &#10237;
                </Button>
                {scanned && (
                  <Button
                    title="Tap to Scan Again"
                    loadingProps={{ size: "small", color: "white" }}
                    buttonStyle={{
                      backgroundColor: "rgba(111, 202, 186, 1)",
                      borderRadius: 5,
                    }}
                    titleStyle={{ fontWeight: "bold", fontSize: 23 }}
                    containerStyle={{
                      marginHorizontal: 30,
                      height: 50,
                      width: 200,
                      marginVertical: 10,
                    }}
                    onPress={() => setScanned(false)}
                  />
                )}
              </View>
            </>
          ) : (
            <TouchableHighlight
              underlayColor="#DDDDDD"
              style={styles.button}
              onPress={() => {
                setHasPermission(true);
              }}
            >
              <ImageBackground
                source={require("../../assets/qrBackground.png")}
                style={styles.backgroundImage}
                imageStyle={{
                  resizeMode: "cover",
                  borderRadius: 100,
                }}
              >
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <Text adjustsFontSizeToFit={true} style={styles.button__text}>
                    QR Code Scanner
                  </Text>
                </View>
              </ImageBackground>
            </TouchableHighlight>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7fcf7e",
  },
  countdown: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 200,
    height: 200,
    borderWidth: 2,
    backgroundColor: "rgba(81, 81, 201, 0.8)",
    borderColor: "rgba(48, 48, 48, 0.8)",
    borderRadius: 100,
  },
  backButton: {
    width: 40,
    height: 40,
    overflow: "hidden",
    borderRadius: 20,
    textAlign: "center",
    paddingBottom: 8,
  },
  button__text: {
    textAlignVertical: "center",
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  scannedForm: {
    width: "100%",
    height: "80%",
    marginTop: 20,
  },
  buttonsBlock: {
    flex: 1,
    height: "10%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
