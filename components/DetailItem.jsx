import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Item = (props) => {
  return (
    <View style={styles.item}>
      <View style={styles.item__Bar}>
        <Text style={styles.item__header}>{props.text}</Text>
        <Text style={styles.item__text}>{props.detail}</Text>
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
  item__Bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"center",
    flexWrap: "wrap",
  },
  item__text: {
    maxWidth: "95%",
  },
  item__header:{
    fontSize:20,
    paddingBottom:5,
    fontWeight:'600',
    
  }
});

export default Item;
