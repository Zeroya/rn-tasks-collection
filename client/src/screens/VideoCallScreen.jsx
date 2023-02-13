import React, { useState, useEffect } from "react";
import "expo-dev-client";
import { Text } from "react-native-elements";
import AgoraUIKit from "agora-rn-uikit";
import { useDispatch } from "react-redux";
import socket from "../utils/socket";
import { changeCallChecker } from "../store/reducers/UserSlice";

const VideoCallScreen = ({ navigation }) => {
  const [videoCall, setVideoCall] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    //!videoCall && socket.emit("callUserInfo", { callName: "", checker: false });
    !videoCall && navigation.goBack();
    // .navigate("Messaging")
    // UserProfile
  }, [videoCall]);

  const setCallChecker = () => {
    //socket.emit("callUserInfo", { callName: "", checker: false });
    // dispatch(changeCallChecker());
    setVideoCall(false);
  };

  useEffect(() => {
    socket.emit("callUserInfo", { callName: "", checker: false });
  }, [setCallChecker]);

  const props = {
    connectionData: {
      appId: "5746bfe42f0f4733ba87b71f30098468",
      channel: "ChatRN",
      token:
        "007eJxTYNis9lZ2j4VC9PxZh9m3p3zRnOPLmXR7xfTE/Dt3nTgvvTFUYDA1NzFLSks1MUozSDMxNzZOSrQwTzI3TDM2MLC0MDGzcHR5ltwQyMgg/7GBmZEBAkF8NgbnjMSSID8GBgB2Fh9s",
    },
    rtcCallbacks: {
      EndCall: () => setCallChecker(),
    },
  };

  return videoCall ? (
    <AgoraUIKit connectionData={props.connectionData} rtcCallbacks={props.rtcCallbacks} />
  ) : (
    <Text onPress={() => setVideoCall(true)}>Start Call</Text>
  );
};

export default VideoCallScreen;
