import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "./HomeScreen";
import DetailsScreen from "./DetailsScreen";
import SettingsScreen from "./SettingsScreen";
import TimerScreen from "./TimerScreen";
import QrScanner from "./QrScanner";
import ChatScreen from "./ChatScreen";
import CalendarScreen from "./CalendarScreen";

const homeName = "Home";
const detailsName = "Details";
const settingsName = "Settings";
const timersName = "Timer";
const scannerName = "QrScanner";
const chatName = "Chat";
const calendarName = "Calendar";

const Tab = createBottomTabNavigator();

function MainContainer() {
  return (
    <>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "green",
          tabBarInactiveTintColor: "grey",
          tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
          tabBarStyle: { padding: 10, height: 70 },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? "home" : "home-outline";
            } else if (rn === detailsName) {
              iconName = focused ? "list" : "list-outline";
            } else if (rn === timersName) {
              iconName = focused ? "caret-forward-circle" : "caret-forward-circle-outline";
            } else if (rn === scannerName) {
              iconName = focused ? "md-qr-code-outline" : "md-qr-code-sharp";
            } else if (rn === chatName) {
              iconName = focused ? "chatbubbles" : "chatbubbles";
            } else if (rn === settingsName) {
              iconName = focused ? "settings" : "settings-outline";
            } else if (rn === calendarName) {
              iconName = focused ? "calendar" : "calendar-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen options={{ headerShown: false }} name={homeName} component={HomeScreen} />
        <Tab.Screen options={{ headerShown: false }} name={detailsName} component={DetailsScreen} />
        <Tab.Screen options={{ headerShown: false }} name={timersName} component={TimerScreen} />
        <Tab.Screen options={{ headerShown: false }} name={scannerName} component={QrScanner} />
        <Tab.Screen options={{ headerShown: false }} name={chatName} component={ChatScreen} />
        <Tab.Screen options={{ headerShown: false }} name={calendarName} component={CalendarScreen} />
        <Tab.Screen name={settingsName} component={SettingsScreen} />
      </Tab.Navigator>
    </>
  );
}

export default MainContainer;
