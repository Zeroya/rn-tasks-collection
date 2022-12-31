import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "@rneui/themed";

const Header = ({ navigation: { navigate } }) => {
  return (
    <Button
      onPress={() => navigate("Login")}
      title="LOG OUT"
      buttonStyle={styles.buttonStyle}
      containerStyle={styles.containerStyle}
      titleStyle={{ fontWeight: "bold" }}
    />
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: "rgba(11, 2, 7, 0.8)",
    borderWidth: 2,
    borderColor: "rgba(11, 2, 7, 0.2)",
    borderRadius: 30,
  },
  containerStyle: {
    width: 150,
    marginLeft: "auto",
    marginRight: 25,
    marginTop: 25,
  },
});

export default Header;
