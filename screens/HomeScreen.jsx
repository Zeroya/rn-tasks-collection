import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Header from "../components/Header";
import Item from "../components/Item";

export default function HomeScreen({ navigation }) {
  const taskItems = ["Read docs", "go outside", "prepare homework", "pass a diploma", "rewrite task styles "];
  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <Image style={styles.tinyLogo} source={require("../assets/iconReenbit2.png")} />
      <ScrollView style={styles.list}>
        <Text style={styles.list__title}>My List</Text>
        <View style={styles.list__items}>
          {Array(5)
            .fill(taskItems)
            .flat()
            .map((item, index) => (
              <Item key={index} text={item} />
            ))}
        </View>
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
  list__title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  list__items: {
    marginTop: 20,
  },
});
