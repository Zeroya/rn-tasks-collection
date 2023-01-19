import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert, Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import { BASE_URL } from "../constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SocialIcon } from "react-native-elements";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [userInfo, setUserInfo] = useState();
  const [auth, setAuth] = useState();
  const [requireRefresh, setRequireRefresh] = useState(false);

  const [gRequest, gResponse, gPromptAsync] = Google.useAuthRequest({
    androidClientId: "139581308140-n3ebiqnid8tmskvneo7lck2cku8va9s3.apps.googleusercontent.com",
    iosClientId: "608926672044-pcaf58q4fjjbtvn25ggs85fk881fa22n.apps.googleusercontent.com",
    expoClientId: "608926672044-a9aj3tj5inpvep5lld4dmdogokmm3mo8.apps.googleusercontent.com",
  });

  // const useProxy = Constants.appOwnership === "expo" ? true : false;

  const [_, __, fbPromptAsync] = Facebook.useAuthRequest(
    {
      clientId: "728254951884474",
      expoClientId: "728254951884474",
      // responseType: ResponseType.Code,
      //  scopes: ["public_profile", "email", "user_location", "user_hometown"],
      //   redirectUri: makeRedirectUri({
      //     native: "fb728254951884474://authorize",
      //     useProxy,
      //   }),
    }
    // { useProxy: true }
  );

  const loginApiCall = async (url, body) => {
    const res = await fetch(url, {
      method: "POST",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const status = res.status;
    const data = await res.json();

    if (status !== 400) {
      await AsyncStorage.setItem("username", name);
      setName("");
      setPassword("");
      navigation.navigate("User");
      console.log(data);
    } else {
      setName("");
      setPassword("");
      Alert.alert(data.msg);
    }
  };

  const onLoginPressed = async () => {
    if (!name.trim() && !password.trim()) {
      Alert.alert("Please enter username and password");
    } else if (!name.trim() && password.trim()) {
      Alert.alert("Please enter username ");
    } else if (name.trim() && !password.trim()) {
      Alert.alert("Please enter password ");
    } else {
      await loginApiCall(BASE_URL + "/auth/login", {
        userName: name,
        password: password,
      });
    }
  };

  // useEffect(() => {
  //   console.log(gResponse);
  //   if (gResponse?.type === "success") {
  //     setAuth(gResponse.authentication);
  //     auth && getUserGoogleData();
  //     navigation.navigate("User");
  //     // Alert.alert(`Logged in, hi ${userInfo.name}`);
  //   }
  // }, [gResponse]);

  // useEffect(() => {
  //   console.log(fbResponse);
  //   if (fbResponse?.type === "success") {
  //     // const { code } = fbResponse.params;
  //     // setAuth(code);
  //     setAuth(fbResponse.authentication);
  //     auth && getUserFacebookData();
  //     navigation.navigate("User");
  //     //  Alert.alert(`Logged in, hi ${userInfo.name} `);
  //   }
  // }, [fbResponse]);

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
        // loginApiCall("http://192.168.0.108:3004/auth/login", {
        //   userName,
        //   password: "Google",
        // });
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
        // await loginApiCall("http://192.168.0.108:3004/auth/login", {
        //   userName,
        //   password: "Facebook",
        // });
      } else {
        Alert.alert(`Error with login!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  console.log("<-----------", userInfo);

  return (
    <View style={styles.login}>
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
      <View style={styles.button__container}>
        <TouchableOpacity style={styles.button__form} onPress={onLoginPressed}>
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.relocateBlockStyle}>
        <Text onPress={() => navigation.navigate("Register")}>New Here ? Register</Text>
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

export default LoginScreen;

const styles = StyleSheet.create({
  login: {
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
    borderBottomColor: "rgba(65, 237, 17, 1)",
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
    backgroundColor: "rgba(65, 237, 17, 1)",
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
    backgroundColor: "rgba(0, 78, 0, 0.8)",
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
