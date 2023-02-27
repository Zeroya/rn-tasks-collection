import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, SafeAreaView, Button, Platform } from "react-native";
import { Agenda } from "react-native-calendars";
import Icon from "react-native-vector-icons/Ionicons";
import { Card, Avatar } from "react-native-paper";
import ModalForm from "../components/ModalForm";
import { registerForPushNotificationsAsync, schedulePushNotification } from "../services/notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const CalendarScreen = ({ navigation }) => {
  //const [color, setColor] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState("");
  const [items, setItems] = useState({});
  const todayDate = new Date().toISOString().slice(0, 10);
  const [testItems, setTestItems] = useState({
    "2023-02-11": [
      {
        name: "heeiii 1111",
        time: "10:00 - 13:00",
        notificationScheduled: false,
        eventNotified: false,
        callTo: "asdfg",
      },
    ],
    "2023-02-12": [],
    "2023-02-13": [],
    "2023-02-21": [
      {
        name: "heeiii 2211",
        time: "15:00 - 17:00",
        notificationScheduled: false,
        eventNotified: false,
        callTo: "qwerty",
      },
    ],
    "2023-02-23": [],
    "2023-02-25": [
      {
        name: "heeiii 3311",
        time: "8:00 - 10:00",
        notificationScheduled: false,
        eventNotified: false,
        callTo: "asdfg",
      },
      {
        name: "heeiii 3331",
        time: "12:00 - 14:00",
        notificationScheduled: false,
        eventNotified: false,
        callTo: "qwerty",
      },
      {
        name: "heeiii 3331",
        time: "18:00 - 22:00",
        notificationScheduled: false,
        eventNotified: false,
        callTo: "asdfg",
      },
    ],
  });

  const filteredItems = Object.fromEntries(
    Object.entries(testItems).map(([date, items]) => [date, items.filter((item) => item.callTo === user)])
  );

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const getUsername = async () => {
    try {
      const value = await AsyncStorage.getItem("username");
      if (value !== null) {
        setUser(value);
      }
    } catch (e) {
      console.error("Error while loading username!");
    }
  };

  useEffect(() => {
    loadItems({ dateString: "2023-02-22", day: 22, month: 2, timestamp: 1677024000000, year: 2023 });
    getUsername();
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

  const timerRef = useRef(null);
  const [notificationScheduled, setNotificationScheduled] = useState(false);
  const [eventNotified, setEventNotified] = useState(false);

  useEffect(() => {
    const checkNotifications = () => {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today
        .getDate()
        .toString()
        .padStart(2, "0")}`;

      const todayEvents = filteredItems[todayStr] || [];

      todayEvents.forEach((event) => {
        const [startTimeStr, endTimeStr] = event.time.split(" - ");
        const [startHour, startMinute] = startTimeStr.split(":").map(Number);

        const notificationTime = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          startHour,
          startMinute - 10,
          0
        );
        const eventStartTime = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          startHour,
          startMinute,
          0
        );

        //     if (!notificationScheduled && today.getTime() < eventStartTime.getTime() - 10 * 60 * 1000) {
        //       // Schedule notification for 10 minutes before the event
        //       clearTimeout(timerRef.current);
        //       timerRef.current = setTimeout(() => {
        //         schedulePushNotification();
        //         setNotificationScheduled(true);
        //       }, notificationTime.getTime() - today.getTime());
        //     } else if (!eventNotified && today.getTime() >= eventStartTime.getTime()) {
        //       // Notify about the event
        //       clearTimeout(timerRef.current);
        //       schedulePushNotification();
        //       setEventNotified(true);
        //     }
        //   });
        // };

        if (today.getTime() < eventStartTime.getTime() - 10 * 60 * 1000) {
          // Schedule first notification if it hasn't been scheduled yet
          if (!event.notificationScheduled) {
            event.notificationScheduled = true;
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
              schedulePushNotification("Your meet will be in 10 minutes");
            }, notificationTime.getTime() - today.getTime());
          }
        } else if (today.getTime() < eventStartTime.getTime() + 60000) {
          // Schedule second notification if it hasn't been scheduled yet
          if (!event.eventNotified) {
            event.eventNotified = true;
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
              schedulePushNotification("Join your meet now");
            }, eventStartTime.getTime() - today.getTime());
          }
        } else {
          // Event is over, reset notification flags
          event.notificationScheduled = false;
          event.eventNotified = false;
        }
      });
    };

    checkNotifications();

    // Update every minute
    const intervalId = setInterval(checkNotifications, 20000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timerRef.current);
    };
  }, [testItems]);

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
    console.log(day);
    // setTestItems(addColors(testItems));
    setTimeout(() => {
      for (let i = -115; i < 1785; i++) {
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
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("VideoCall")}>
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
              <Avatar.Text
                label={item.callTo.slice(0, 1).toUpperCase()}
                size={55}
                style={{ backgroundColor: "rgba(20, 129, 219, 0.9)" }}
              />
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
        items={filteredItems}
        loadItemsForMonth={loadItems}
        selected={todayDate}
        openDayScrollView={true}
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
