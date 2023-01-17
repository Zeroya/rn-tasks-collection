import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import { BASE_URL } from "../constants/constants";
import { SocialIcon } from "react-native-elements";

WebBrowser.maybeCompleteAuthSession();

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [userInfo, setUserInfo] = useState();
  const [auth, setAuth] = useState();
  const [requireRefresh, setRequireRefresh] = useState(false);

  const [gRequest, gResponse, gPromptAsync] = Google.useAuthRequest({
    androidClientId: "139581308140-n3ebiqnid8tmskvneo7lck2cku8va9s3.apps.googleusercontent.com",
    iosClientId: "608926672044-pcaf58q4fjjbtvn25ggs85fk881fa22n.apps.googleusercontent.com",
    expoClientId: "608926672044-a9aj3tj5inpvep5lld4dmdogokmm3mo8.apps.googleusercontent.com",
  });

  const [_, __, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: "728254951884474",
    expoClientId: "728254951884474",
  });

  const registerApiCall = (url, body) => {
    return fetch(url, {
      method: "POST",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        try {
          setName("");
          setPassword("");
          setRepeatPassword("");
          navigation.navigate("Login");
          console.log(data);
        } catch (e) {
          console.log("error hai", e);
          Alert(e);
        }
      })
      .catch((error) => {
        console.log("There has been a problem with your fetch operation: " + error.message);
      });
  };

  const onRegisterPressed = async () => {
    if (name.trim() && password.trim() && repeatPassword.trim()) {
      if (repeatPassword === password) {
        await registerApiCall(BASE_URL + "/auth/register", {
          userName: name,
          password: password,
        });
      } else {
        setPassword("");
        setRepeatPassword("");
        Alert.alert("The repeat password field must match the password field");
      }
    } else if (!name.trim() && password.trim() && repeatPassword.trim()) {
      Alert.alert("Please enter username ");
    } else if (name.trim() && !password.trim() && repeatPassword.trim()) {
      Alert.alert("Please enter password ");
    } else if (name.trim() && password.trim() && !repeatPassword.trim()) {
      Alert.alert("Please repeat password ");
    } else {
      Alert.alert("Please enter all fields");
    }
  };

  const getUserGoogleData = async () => {
    try {
      const response = await gPromptAsync();
      if (response?.type === "success") {
        setUserInfo(null);
        const token = response.params.access_token;
        let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        let userName = null;
        await userInfoResponse.json().then((data) => {
          console.log(data);
          setUserInfo(data);
          userName = data.name;
        });
        Alert.alert(`Logged in, hi ${userName}`);
        setAuth(response.authentication);
        navigation.navigate("User");
      } else {
        Alert.alert(`Error with login!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getUserFacebookData = async () => {
    try {
      const response = await fbPromptAsync();
      if (response?.type === "success") {
        setUserInfo(null);
        const token = response.params.access_token;
        let userInfoResponse = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        let userName = null;
        await userInfoResponse.json().then((data) => {
          console.log(data);
          setUserInfo(data);
          userName = data.name;
        });
        Alert.alert(`Logged in, hi ${userName}`);
        setAuth(response.authentication);
        navigation.navigate("User");
      } else {
        Alert.alert(`Error with login!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  console.log("<-----------", userInfo);

  return (
    <View style={styles.register}>
      <TextInput
        placeholder={"Enter user Name"}
        onChangeText={(name) => setName(name)}
        value={name}
        style={styles.login__input}
      />
      <TextInput
        placeholder={"Enter password"}
        onChangeText={(password) => setPassword(password)}
        secureTextEntry={true}
        value={password}
        style={styles.login__input}
      />
      <TextInput
        placeholder={"Repeat password"}
        onChangeText={(password) => setRepeatPassword(password)}
        secureTextEntry={true}
        value={repeatPassword}
        style={styles.login__input}
      />
      <View style={styles.button__container}>
        <TouchableOpacity style={styles.button__form} onPress={onRegisterPressed}>
          <Text>Register</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.relocateBlockStyle}>
        <Text onPress={() => navigation.navigate("Login")}>Have an acount ? Login</Text>
      </View>
      <View style={styles.media__container}>
        <View style={styles.orBlock}>
          <Text>Or</Text>
        </View>
        <SocialIcon
          style={styles.button__media}
          title="Sign In Google"
          button
          type="google"
          onPress={() => getUserGoogleData()}
        />
        <SocialIcon
          style={styles.button__media}
          button
          title="Sign In Facebook"
          type="facebook"
          onPress={() => getUserFacebookData()}
        />
      </View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  register: {
    width: "100%",
    height: "100%",
    marginTop: 55,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(65, 237, 17, 0.08)",
  },
  login__input: {
    height: 35,
    width: "70%",
    borderBottomWidth: 2,
    borderBottomColor: "rgba(51, 51, 143, 1)",
    marginTop: "2%",
  },
  button__container: {
    marginTop: "7%",
    width: "80%",
  },
  button__form: {
    borderWidth: 1,
    height: 30,
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    backgroundColor: "rgba(51, 51, 143, 1)",
    alignSelf: "center",
  },
  media__container: {
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  orBlock: {
    padding: 5,
    marginVertical: 10,
    width: 30,
    backgroundColor: "rgba(51, 51, 143, 1)",
    borderRadius: 15,
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
  },
  button__media: {
    padding: 25,
    marginTop: 15,
  },
  relocateBlockStyle: {
    marginTop: 10,
  },
});
