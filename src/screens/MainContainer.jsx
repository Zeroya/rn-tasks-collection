import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './HomeScreen';
import DetailsScreen from './DetailsScreen';
import SettingsScreen from './SettingsScreen';
import TimerScreen from './TimerScreen';

const homeName = "Home";
const detailsName = "Details";
const settingsName = "Settings";
const timersName = "Timer";

const Tab = createBottomTabNavigator();

function MainContainer() {
  return (
    <>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: 'grey',
          tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
          tabBarStyle: { padding: 10, height: 70},
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? 'home' : 'home-outline';

            } else if (rn === detailsName) {
              iconName = focused ? 'list' : 'list-outline';

            } else if (rn === timersName) {
              iconName = focused ? 'caret-forward-circle' : 'caret-forward-circle-outline';
            }
             else if (rn === settingsName) {
              iconName = focused ? 'settings' : 'settings-outline';
            }
           
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}>

        <Tab.Screen options={{headerShown: false}} name={homeName} component={HomeScreen} />
        <Tab.Screen options={{headerShown: false}} name={detailsName} component={DetailsScreen} />
        <Tab.Screen options={{headerShown: false}} name={timersName} component={TimerScreen} />
        <Tab.Screen  name={settingsName} component={SettingsScreen} />

      </Tab.Navigator>
    </>
  );
}

export default MainContainer;