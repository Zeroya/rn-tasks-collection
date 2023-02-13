import React, { useState, useEffect } from "react";
import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity } from "react-native";
import { Linking } from "react-native";
import { Avatar, Icon } from "react-native-elements";
import { useDispatch } from "react-redux";
import socket from "../utils/socket";
import { changeCallChecker, saveCallName } from "../store/reducers/UserSlice";

const UserProfileScreen = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const phoneNumber = "067 149 12 65";

  const getUsername = async () => {
    try {
      if (route.params !== null) {
        setName(route.params);
      } else {
        setName("Guest");
      }
    } catch (e) {
      console.error("Error while loading username!");
    }
  };

  const setCallChecker = () => {
    socket.emit("callUserInfo", { callName: name, checker: true });
    dispatch(changeCallChecker());
    dispatch(saveCallName(name));
    navigation.navigate("VideoCall");
  };

  useEffect(() => {
    getUsername();
  }, []);

  // useEffect(() => {
  //   socket.emit("callUserInfo", { callName: name, checker: true });
  // }, [setCallChecker, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Avatar
          size={110}
          rounded
          title={name.slice(0, 1).toUpperCase()}
          containerStyle={{ backgroundColor: "black" }}
        />
        <Text style={styles.headerTitle}>{name}</Text>
      </View>
      <View
        style={{
          borderBottomColor: "black",
          alignSelf: "stretch",
          borderBottomWidth: 4,
        }}
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => Linking.openURL(`tel:${phoneNumber}`)}>
          <Icon reverse name="call-sharp" type="ionicon" color="green" />
        </TouchableOpacity>
        <TouchableOpacity onPress={setCallChecker}>
          <Icon reverse name="videocam-sharp" type="ionicon" color="rgba(39, 39, 255, 1)" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
    alignItems: "center",
  },
  header: {
    marginTop: 15,
  },
  headerTitle: {
    marginTop: 6,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 24,
  },
  buttonsContainer: {
    flex: 1,
    marginTop: 10,
    flexDirection: "row",
  },
});
