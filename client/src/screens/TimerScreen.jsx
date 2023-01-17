import React, { useEffect, useState } from "react";
import { StyleSheet, Text, SafeAreaView, View, Vibration, TouchableHighlight, Alert } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { useNetInfo } from "@react-native-community/netinfo";
import { useSelector } from "react-redux";
import Header from "../components/Header";

export default function TimerScreen({ navigation }) {
  const netInfo = useNetInfo();
  const timeValue = useSelector((state) => state.user.timeValue);

  const [key, setKey] = useState(0);
  const [timeDuration, setTimeDuration] = useState(10);
  const [updatedTimer, setUpdatedTimer] = useState(10);
  const [playPermission, setPlayPermission] = useState(false);
  const [bgConnect, setBgConnect] = useState(true);
  const [netConnection, setNetConnectiont] = useState(false);
  const [netChecker, setNetChecker] = useState(false);

  useEffect(() => {
    setBgConnect(!!netInfo.isConnected);
    setNetConnectiont(playPermission && !netInfo.isConnected);
    if (netInfo.isConnected && updatedTimer < timeDuration) {
      setKey((prevKey) => prevKey + 1);
    }
  }, [netInfo.isConnected, netChecker]);

  useEffect(() => {
    timeValue && setTimeDuration(timeValue);
    timeValue && setUpdatedTimer(timeValue);
    setPlayPermission(false);
    setNetConnectiont(false);
    setKey((prevKey) => prevKey + 1);
  }, [timeValue]);

  const formDate = ({ remainingTime }) => {
    const h = Math.floor(remainingTime / 3600);
    const m = Math.floor((remainingTime % 3600) / 60);
    const s = Math.floor((remainingTime % 3600) % 60);

    const hDisplay = h > 0 ? `${h.toString().length > 1 ? `${h}` : `${0}${h}`}` : "00";
    const mDisplay = m > 0 ? `${m.toString().length > 1 ? `${m}` : `${0}${m}`}` : "00";
    const sDisplay = s > 0 ? `${s.toString().length > 1 ? `${s}` : `${0}${s}`}` : "00";

    return remainingTime >= 3600
      ? `${hDisplay}:${mDisplay}:${sDisplay}`
      : remainingTime >= 60
      ? `${mDisplay}:${sDisplay}`
      : sDisplay;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgConnect ? "#7fcf7e" : "#C66E6E" }]}>
      <Header navigation={navigation} />
      <View style={styles.countdown}>
        <CountdownCircleTimer
          key={key}
          isPlaying={netConnection}
          duration={timeDuration}
          colors={bgConnect ? ["#116138", "#21E580"] : ["#240404", "#6A5E5E"]}
          colorsTime={[timeDuration, 0]}
          onUpdate={(remainingTime) => setUpdatedTimer(remainingTime)}
          onComplete={() => {
            setKey((prevKey) => prevKey + 1);
            setPlayPermission(false);
            setNetChecker(false);
            setNetConnectiont(!netConnection);
            !bgConnect && Vibration.vibrate(4000);
            !bgConnect && Alert.alert("You don't have an internet connection");
            return { shouldRepeat: true, delay: 4 };
          }}
        >
          {({ remainingTime }) => (
            <>
              <TouchableHighlight
                underlayColor="#DDDDDD"
                onPress={() => {
                  setKey((prevKey) => prevKey + 1);
                  setPlayPermission(!playPermission);
                  setNetChecker(!netChecker);
                }}
                style={[
                  styles.button,
                  { backgroundColor: !playPermission ? "#808781" : !bgConnect ? "#8C3913" : "#0C3913" },
                ]}
              >
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <Text adjustsFontSizeToFit={true} style={{ textAlignVertical: "center", textAlign: "center" }}>
                    {formDate({ remainingTime })}
                  </Text>
                </View>
              </TouchableHighlight>
            </>
          )}
        </CountdownCircleTimer>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  countdown: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "93%",
    height: "93%",
    borderWidth: 2,
    borderColor: "rgba(11, 2, 7, 0.2)",
    borderRadius: 100,
  },
});
