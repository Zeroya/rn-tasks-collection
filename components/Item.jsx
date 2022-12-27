import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Item = (props) => {
  return (
    <View style={styles.item}>
      <View style={styles.item__leftBar}>
        <TouchableOpacity style={styles.item__toggle} />
        <Text style={styles.item__text}>{props.text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#4d804f",
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
  },
  item__leftBar: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  item__toggle: {
    width: 24,
    height: 24,
    backgroundColor: "#badebf",
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  item__text: {
    maxWidth: "80%",
  },
});

export default Item;
