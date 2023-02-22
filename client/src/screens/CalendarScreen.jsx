import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, SafeAreaView, Button, Platform } from "react-native";
import { Agenda } from "react-native-calendars";
import Icon from "react-native-vector-icons/Ionicons";
import { Card, Avatar } from "react-native-paper";
import ModalForm from "../components/ModalForm";
import { registerForPushNotificationsAsync, schedulePushNotification } from "../services/notification";
import * as Notifications from "expo-notifications";

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const CalendarScreen = () => {
  //const [color, setColor] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState({});
  const [testItems, setTestItems] = useState({
    "2022-07-11": [{ name: "heeiii 1111", time: "10:00 - 13:00" }],
    "2022-07-12": [],
    "2022-07-13": [],
    "2022-07-21": [{ name: "heeiii 2211", time: "15:00 - 17:00" }],
    "2022-07-15": [
      { name: "heeiii 3311", time: "8:00 - 10:00" },
      { name: "heeiii 3331", time: "12:00 - 14:00" },
      { name: "heeiii 3331", time: "18:00 - 22:00" },
    ],
  });

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  function rgb2hex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  const addColors = (testItemsAll) => {
    const updatedTestItems = {};
    Object.keys(testItemsAll).forEach((key) => {
      const innerArray = testItemsAll[key];
      const updatedInnerArray =
        innerArray.length > 0
          ? innerArray.map((item) => ({
              ...item,
              colorIcon: generateColor(),
              colorUser: generateColor().replace("rgb", "rgba").slice(0, -1) + ", 0.4)",
            }))
          : [];
      updatedTestItems[key] = updatedInnerArray;
    });
    return updatedTestItems;
    // const updatedData = testItems.map((item) => {
    //   return { ...item, color: generateColor() };
    // });
    // return updatedData;
  };

  const addNewEvent = () => {
    setTestItems({
      ...testItems,
      "2022-07-11": [...testItems["2022-07-11"], { time: "10:00 - 13:00" }],
    });
  };

  const generateColor = () => {
    const k1 = 64;
    const k2 = 255 - k1;
    const r = Math.random() * k1 + k2;
    const g = Math.random() * k1 + k2;
    const b = Math.random() * k1 + k2;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const loadItems = (day) => {
    // setTestItems(addColors(testItems));
    setTimeout(() => {
      for (let i = -15; i < 785; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);

        if (!testItems[strTime]) {
          testItems[strTime] = [];

          // const numItems = Math.floor(Math.random() * 3 + 1);
          // for (let j = 0; j < numItems; j++) {
          //   items[strTime].push({
          //     name: "Item for " + strTime + " #" + j,
          //     height: Math.max(10, Math.floor(Math.random() * 150)),
          //     day: strTime,
          //   });
          // }
        }
        // else {
        //   console.log(testItems[strTime]);
        //   // testItems[strTime] = addColors(testItems[strTime]);
        // }
      }
      // const newArr = Object.entries(testItems).map((el) => ({ ...el, el[0].map((elem)=> { ...elem , color: generateColor()}) }));
      //const newArr = testItems.map((el) => el.map(elem => ...elem, color: generateColor()) );
      // console.log(Object.fromEntries(newArr));
      //setTestItems(newArr);
      const newItems = {};
      Object.keys(testItems).forEach((key) => {
        newItems[key] = testItems[key];
      });
      // setTestItems(newItems);
      // console.log("11111", newItems);
      // console.log("22222", addColors(newItems));
      setTestItems(addColors(newItems));
      // console.log(items);
    }, 10);
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity style={styles.item}>
        <Card style={[styles.cardForm, { shadowColor: item.colorUser }]}>
          <Card.Content>
            <View style={styles.itemBody}>
              <View style={styles.itemBody}>
                <Icon
                  name="videocam-outline"
                  style={[styles.icon, { backgroundColor: item.colorIcon }]}
                  size={30}
                  color="#4F8EF7"
                />
                <View>
                  <Text style={{ fontSize: 16, fontWeight: "800" }}>{item.time}</Text>
                  <Text style={styles.itemText}> Click here to join meet!</Text>
                  {/* <Text>{item.name}</Text> */}
                </View>
              </View>
              <Avatar.Text label="J" size={55} style={{ backgroundColor: "rgba(20, 129, 219, 0.9)" }} />
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text style={{ color: "grey" }}>No event for current date</Text>
      </View>
    );
  };

  // const MyCustomList = () => {
  //   return (
  //     <View>
  //       {!calendarOpen && (
  //         <Button
  //           title="Add new event"
  //           color="rgba(39, 149, 196, 0.5)"
  //           accessibilityLabel="Learn more about this purple button"
  //         />
  //       )}
  //     </View>
  //   );
  // };

  const rowHasChanged = (r1, r2) => r1.name !== r2.name;

  return (
    <SafeAreaView style={styles.container}>
      <Agenda
        items={testItems}
        loadItemsForMonth={loadItems}
        selected={"2022-07-07"}
        // refreshControl={null}
        // showClosingKnob={true}
        // refreshing={false}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={rowHasChanged}
        onCalendarToggled={(open) => setCalendarOpen(open)}
        // onCalendarToggled={(calendarOpened) => {
        //   <MyCustomList />;
        //   //  setCalendarOpen(!calendarOpen);
        // }}
        // renderList={(listProps) => {
        //   return <MyCustomList items={listProps.items} />;
        // }}
      />
      {!calendarOpen && (
        <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
          <Icon name="add-outline" size={50} />
        </TouchableOpacity>
      )}
      {!calendarOpen && (
        <TouchableOpacity
          style={[styles.button, { right: "auto", left: "auto" }]}
          onPress={async () => {
            await schedulePushNotification();
          }}
        >
          <Icon name="add-outline" size={50} />
        </TouchableOpacity>
      )}
      {visible && <ModalForm setVisible={setVisible} setItems={setTestItems} items={testItems} />}
      <StatusBar />
    </SafeAreaView>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  cardForm: {
    shadowOffset: { width: 14, height: 14 },
    shadowOpacity: 0.58,
    shadowRadius: 16,
    elevation: 24,
  },
  itemBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    marginRight: 15,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 25,
  },
  emptyDate: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  itemText: {
    marginTop: 5,
    fontSize: 13,
    color: "background-color: rgba(46, 46, 46, 0.7);",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#095700",
    width: 60,
    height: 60,
    paddingLeft: 3,
    borderRadius: 30,
    position: "absolute",
    right: 10,
    bottom: 10,
  },
});