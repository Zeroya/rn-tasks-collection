import * as React from "react";
import "expo-dev-client";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import MainContainer from "./src/screens/MainContainer";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import MapScreen from "./src/screens/MapScreen";
import MessagingScreen from "./src/screens/MessagingScreen";
import VideoCallScreen from "./src/screens/VideoCallScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserProfileScreen from "./src/screens/UserProfileScreen";
import { Provider } from "react-redux";
import { store } from "./src/store/store";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} />
            <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
            <Stack.Screen options={{ headerShown: false }} name="User" component={MainContainer} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="VideoCall" component={VideoCallScreen} />
            <Stack.Screen name="Messaging" component={MessagingScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar theme="auto" />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});
