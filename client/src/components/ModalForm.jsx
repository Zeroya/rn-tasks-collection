import { View, Text, TextInput, Pressable, StyleSheet, Modal, Button } from "react-native";
import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import socket from "../utils/socket";
import { BASE_URL } from "../constants/constants";

const ModalForm = ({ setVisible, setItems, items }) => {
  const [formData, setFormData] = useState({ date: "", time: "", caller: "" });
  const [allUsers, setAllUsers] = useState([]);
  const [callName, setCallName] = useState("Unknown");
  //const [date, setDate] = useState("09-10-2021");
  const [datePicker, setDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const [timePicker, setTimePicker] = useState(false);
  const [time, setTime] = useState(new Date(Date.now()));
  const [time2Picker, setTime2Picker] = useState(false);
  const [time2, setTime2] = useState(new Date(Date.now()));

  let dataWithFormat = "" + date.toISOString().slice(0, 10).trim();
  let dataTimeFormat = `${time
    .toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    .slice(0, 5)} - ${time2.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }).slice(0, 5)} `;

  function showDatePicker() {
    setDatePicker(true);
  }

  function showTimePicker() {
    setTimePicker(true);
  }

  function showTime2Picker() {
    setTime2Picker(true);
  }

  function onDateSelected(event, value) {
    setDate(value);
    setDatePicker(false);
  }

  console.log("allUsers", allUsers);

  function onTimeSelected(event, value) {
    setTime(value);
    setTimePicker(false);
  }

  function onTime2Selected(event, value) {
    setTime2(value);
    setTime2Picker(false);
  }

  useEffect(() => {
    async function getAllUsers() {
      const res = await fetch(BASE_URL + "/auth/allUsers");
      const data = await res.json();
      setAllUsers(data);
      console.log("data", data);
    }

    getAllUsers();
  }, []);

  const addNewEvent = () => {
    let key = dataWithFormat;
    socket.emit("createNewEvent", {
      ...items,
      [key]: [
        ...items[key],
        { time: dataTimeFormat, notificationScheduled: false, eventNotified: false, callTo: callName },
      ],
    });
    // setItems({
    //   ...items,
    //   [key]: [
    //     ...items[key],
    //     { time: dataTimeFormat, notificationScheduled: false, eventNotified: false, callTo: callName },
    //   ],
    // });
  };

  const closeModal = () => setVisible(false);

  const handleAddEvent = () => {
    closeModal();
    addNewEvent();
  };

  return (
    <View style={styles.container}>
      <Modal animationType="fade" transparent={true} style={styles.modalContainer}>
        <View style={styles.modal}>
          <Text style={styles.titleModal}>Add New Event</Text>
          {/* <Text style={styles.text}>Date = {date.toDateString()}</Text>
          <Text style={styles.text}>Time = {time.toLocaleTimeString("en-US")}</Text> */}
          <View style={styles.inputWrapper}>
            {datePicker && (
              <DateTimePicker
                value={date}
                mode={"date"}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                is24Hour={true}
                onChange={onDateSelected}
                style={styles.datePicker}
              />
            )}

            {timePicker && (
              <DateTimePicker
                value={time}
                mode={"time"}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                is24Hour={false}
                onChange={onTimeSelected}
                style={styles.datePicker}
              />
            )}

            {time2Picker && (
              <DateTimePicker
                value={time2}
                mode={"time"}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                is24Hour={false}
                onChange={onTime2Selected}
                style={styles.datePicker}
              />
            )}
            <View style={styles.textDateWrapper}>
              <Text style={[styles.textDate, { paddingLeft: 20 }]}>
                {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }).slice(0, 5)}
              </Text>
              <Text style={[styles.textDate, { paddingRight: 15 }]}>
                {time2.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }).slice(0, 5)}
              </Text>
            </View>
            <View style={styles.dateWrapper}>
              {!timePicker && (
                <View style={{ margin: 10 }}>
                  <Button title="Start Time" color="green" style={styles.buttonDate} onPress={showTimePicker} />
                </View>
              )}
              {!time2Picker && (
                <View style={{ margin: 10 }}>
                  <Button title="End Time" color="green" style={styles.buttonDate} onPress={showTime2Picker} />
                </View>
              )}
            </View>
            <View>
              <Text style={styles.textDate}>{date.toISOString().slice(0, 10)}</Text>
              {!datePicker && (
                <View style={{ margin: 10 }}>
                  <Button title="Pick Date" color="green" style={styles.buttonDate} onPress={showDatePicker} />
                </View>
              )}
            </View>
            <View>
              <Picker
                selectedValue={callName}
                onValueChange={(value, index) => setCallName(value)}
                mode="dropdown" // Android only
                style={styles.picker}
              >
                <Picker.Item label="Call to" value="Unknown" />
                {allUsers?.map((user, index) => (
                  <Picker.Item label={user} value={user} key={index} />
                ))}
              </Picker>
            </View>
            {/* <TextInput
              style={styles.modalInput}
              placeholder="Time"
              onChangeText={(value) => setFormData({ ...formData, time: value })}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Select User"
              onChangeText={(value) => setFormData({ ...formData, caller: value })}
            /> */}
          </View>
          <View style={styles.modalbuttonContainer}>
            <Pressable style={[styles.modalbutton, { backgroundColor: "red" }]} onPress={closeModal}>
              <Text style={styles.modaltext}>CANCEL</Text>
            </Pressable>
            <Pressable style={[styles.modalbutton, { marginLeft: 15 }]} onPress={handleAddEvent}>
              <Text style={styles.modaltext}>CREATE</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalForm;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.8,
    backgroundColor: "#ecf0f1",
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a8a8a8",
    height: "50%",
    width: "80%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
    marginTop: 140,
    marginLeft: 40,
  },
  titleModal: {
    position: "absolute",
    top: 30,
    fontSize: 20,
    textShadowColor: "red",
    textShadowRadius: 6,
  },
  text: {
    color: "#3f2949",
    marginTop: 10,
  },
  modalbuttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalbutton: {
    width: "30%",
    height: 45,
    backgroundColor: "green",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },
  modaltext: {
    color: "#fff",
  },
  modalInput: {
    height: 40,
    width: 200,
    paddingHorizontal: 10,
    marginBottom: 5,
    borderRadius: 15,
    borderColor: "black",
    borderWidth: 1,
  },
  inputWrapper: {
    marginTop: 30,
  },
  title: {
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
  },
  datePickerStyle: {
    width: 230,
  },
  text: {
    textAlign: "left",
    width: 230,
    fontSize: 16,
    color: "#000",
  },
  datePicker: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: 320,
    height: 260,
    display: "flex",
  },
  buttonDate: {
    width: 200,
  },
  dateWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textDateWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  textDate: {
    textAlign: "center",
  },
});
