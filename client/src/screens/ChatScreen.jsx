import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Header from "../components/Header";

export default function ChatScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <Image style={styles.tinyLogo} source={require("../../assets/iconReenbit2.png")} />
      <ScrollView style={styles.list}>
        <Text>Test</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7fcf7e",
  },
  tinyLogo: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 35,
    marginBottom: 10,
    width: 80,
    height: 50,
  },
  list: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
});
