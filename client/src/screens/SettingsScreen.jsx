import React, { useState } from "react";
import { Button } from "@rneui/themed";
import { ScrollView, StyleSheet, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import { addTimeValue } from "../store/reducers/UserSlice";
import {
  SettingsDividerShort,
  SettingsDividerLong,
  SettingsEditText,
  SettingsCategoryHeader,
  SettingsSwitch,
  SettingsPicker,
} from "react-native-settings-components";

export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    username: "yan",
    allowPushNotifications: false,
    gender: "",
  });
  const [timeValue, setTimeValue] = useState(140);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "rgba(0, 52, 0, 1)",
      }}
    >
      <SettingsCategoryHeader title={"My Account"} containerStyle={{ marginBottom: 10 }} />
      <SettingsDividerLong android={false} />
      <SettingsEditText
        title="Username"
        dialogDescription={"Enter your username."}
        valuePlaceholder="..."
        negativeButtonTitle={"Cancel"}
        positiveButtonTitle={"Save"}
        onValueChange={(value) => {
          setUserData({ ...userData, username: value });
        }}
        value={userData.username}
      />
      <SettingsDividerShort />
      <SettingsPicker
        title="Gender"
        dialogDescription={"Choose your gender."}
        options={[
          { label: "...", value: "" },
          { label: "male", value: "male" },
          { label: "female", value: "female" },
          { label: "other", value: "other" },
        ]}
        onValueChange={(value) => {
          setUserData({ ...userData, gender: value });
        }}
        value={userData.gender}
        valueStyle={{ color: "green" }}
        mstyleModalButtonsText={{ color: "green" }}
      />

      <SettingsSwitch
        title={"Allow Push Notifications"}
        onValueChange={(value) => {
          setUserData({ ...userData, allowPushNotifications: value });
        }}
        value={userData.allowPushNotifications}
        trackColor={{
          true: "#C70039",
          false: "#efeff3",
        }}
      />
      <SettingsCategoryHeader title={"Сonfiguration"} containerStyle={{ marginBottom: 10 }} />
      <View style={styles.timeValue__Container}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Mobile No. in sec"
          keyboardType="number-pad"
          onChangeText={(numb) => setTimeValue(numb)}
          value={timeValue}
          maxLength={8}
        />
        <Button
          onPress={() =>
            timeValue.trim() &&
            dispatch(addTimeValue(timeValue)) &&
            navigation.navigate("Timer", { paramKey: timeValue })
          }
          style={styles.timeValue__button}
          title="Add num"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  timeValue__Container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "#1C1C1C",
  },
  textInput: {
    paddingLeft: 20,
    height: 35,
    width: "80%",
    color: "white",
    borderBottomWidth: 2,
    borderBottomColor: "rgba(65, 237, 17, 1)",
    marginTop: "2%",
  },
  timeValue__button: {
    width: "20%",
    marginRight: 20,
  },
});
