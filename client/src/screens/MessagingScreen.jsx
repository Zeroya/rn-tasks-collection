import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, TextInput, Text, FlatList, Pressable, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MessageComponent from "../components/Message";
import socket from "../utils/socket";
import { styles } from "../utils/styles";
import { useSelector } from "react-redux";
import CallUpperMenu from "../components/CallUpperMenu";
import { Icon } from "react-native-elements";

const MessagingScreen = ({ route, navigation }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [callInfo, setCallInfo] = useState({});
  const [callRender, setCallRender] = useState(false);

  const callChecker = useSelector((state) => state.user.callChecker);
  const callName = useSelector((state) => state.user.callName);

  const { name, id } = route.params;

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

  useLayoutEffect(() => {
    navigation.setOptions({ title: name });
    getUsername();
    socket.emit("findRoom", id);
    socket.on("foundRoom", (roomChats) => setChatMessages(roomChats));
  }, []);

  useEffect(() => {
    socket.emit("findRoom", id);
    socket.on("foundRoom", (roomChats) => setChatMessages(roomChats));
  }, [socket, chatMessages]);

  useEffect(() => {
    socket.on("getUserInfo", (info) => {
      console.log("infooooo2", info);
      info?.callName != callInfo?.callName ? setCallInfo(info) : setCallInfo({});
      console.log("test", callInfo?.checker, callInfo?.callName, user, callInfo?.callName === user);
      callInfo?.checker && callInfo?.callName === user ? setCallRender(true) : setCallRender(false);
    });
    //callInfo?.checker && callInfo?.callName === user ? setCallRender(true) : setCallRender(false);
    console.log("asssssssssssss......", callInfo);
  }, [socket, callInfo]);

  const handleNewMessage = () => {
    const hour = new Date().getHours() < 10 ? `0${new Date().getHours()}` : `${new Date().getHours()}`;
    const mins = new Date().getMinutes() < 10 ? `0${new Date().getMinutes()}` : `${new Date().getMinutes()}`;

    socket.emit("newMessage", {
      message,
      room_id: id,
      user,
      timestamp: { hour, mins },
    });
    setMessage("");
  };

  return (
    <View style={styles.messagingscreen}>
      {callRender && <CallUpperMenu navigation={navigation} />}
      <View style={[styles.messagingscreen, { paddingVertical: 15, paddingHorizontal: 10 }]}>
        {chatMessages[0] ? (
          <FlatList
            data={chatMessages}
            renderItem={({ item }) => <MessageComponent navigation={navigation} item={item} user={user} />}
            keyExtractor={(item) => item.id}
          />
        ) : (
          ""
        )}
      </View>

      <View style={styles.messaginginputContainer}>
        <TextInput style={styles.messaginginput} value={message} onChangeText={(value) => setMessage(value)} />
        <Pressable style={styles.messagingbuttonContainer} onPress={handleNewMessage}>
          <View>
            <Text style={{ color: "#f2f0f1", fontSize: 20 }}>SEND</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default MessagingScreen;
