import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Vibration } from "react-native";
import { Icon } from "react-native-elements";
import socket from "../utils/socket";

const CallUpperMenu = ({ navigation }) => {
  const [checker, setChecker] = useState(true);
  const setCallChecker = () => {
    //socket.emit("callUserInfo", { callName: '', checker: false });
    navigation.navigate("VideoCall");
  };

  useEffect(() => {
    socket.emit("callUserInfo", { callName: "", checker: false });
    //  Vibration.cancel();
  }, [socket, checker]);

  // useEffect(() => {
  //   Vibration.vibrate();
  // }, []);

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={setCallChecker}>
          <Icon reverse name="videocam-sharp" type="ionicon" color="rgba(39, 39, 255, 1)" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setChecker(!checker)}>
          <Icon reverse name="call-sharp" type="ionicon" color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CallUpperMenu;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  buttonsContainer: {
    width: "60%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
  },
});
