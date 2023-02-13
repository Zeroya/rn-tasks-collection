import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../utils/styles";

export default function MessageComponent({ item, user, navigation }) {
  const status = item.user !== user;

  // useEffect(() => {
  //   console.log(item);
  //   console.log(item.user);
  //   console.log(user);
  // }, []);

  return (
    <View>
      <View style={status ? styles.mmessageWrapper : [styles.mmessageWrapper, { alignItems: "flex-end" }]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            onPress={() => navigation.navigate("UserProfile", item.user)}
            name="person-circle-outline"
            size={30}
            color="green"
            style={styles.mavatar}
          />
          <View style={status ? styles.mmessage : [styles.mmessage, { backgroundColor: "rgb(194, 243, 194)" }]}>
            <Text style={styles.messageUserName}>{item.user}</Text>
            <Text>{item.text}</Text>
          </View>
        </View>
        <Text style={{ marginLeft: 40 }}>{item.time}</Text>
      </View>
    </View>
  );
}
