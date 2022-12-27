import React, { useEffect, useState } from "react";
import { StyleSheet, Text, SafeAreaView, View, Vibration, TouchableHighlight, Alert } from "react-native";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import {useNetInfo} from "@react-native-community/netinfo";
import { useSelector } from "react-redux";
import Header from "../components/Header";



export default function TimerScreen({ navigation, route }) {
  const netInfo = useNetInfo();
  const timeValue = useSelector((state) => state.user.timeValue);

  const [key, setKey] = useState(0);
  const [timeDuration, setTimeDuration] = useState(10);
  const [playPermission, setPlayPermission] = useState(false);
  const [bgConnect, setBgConnect] = useState(true);

  useEffect(() => {
    setBgConnect(!!netInfo.isConnected);
  },[netInfo.isConnected])

  useEffect(() => {
   // route?.params?.paramKey && setTimeDuration(route?.params?.paramKey);
   timeValue && setTimeDuration(timeValue);
    setPlayPermission(false);
    setKey(prevKey => prevKey + 1);
  },[timeValue])

  const children = ({ remainingTime }) => {
  const hours = Math.floor(remainingTime / 3600)
  const minutes = Math.floor((remainingTime % 3600) / 60)
  const seconds = remainingTime % 60

  return remainingTime > 3600 ? `${hours}:${minutes}:${seconds}` : remainingTime > 60 ? `${minutes}:${seconds}` : seconds
}


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgConnect ? "#7fcf7e" : "#C66E6E"}]}>
      <Header navigation={navigation} />
      <View style={styles.countdown}>
        <CountdownCircleTimer
         key={key}
         isPlaying={playPermission}
         duration={timeDuration}
         colors={bgConnect ? ['#116138', '#21E580'] : ['#240404', '#6A5E5E'] }
         colorsTime={[timeDuration, 0]}
         onComplete={() => { 
          setKey(prevKey => prevKey + 1);
          setPlayPermission(!playPermission)
          !bgConnect && Vibration.vibrate(4000);
          !bgConnect && Alert.alert("You don't have an internet connection");
          return { shouldRepeat: true, delay: 4 }}}
        >
        {({ remainingTime }) => (
          <>
           <TouchableHighlight
           underlayColor="#DDDDDD"
           onPress={() => {
            setKey(prevKey => prevKey + 1);
            setPlayPermission(!playPermission)
          }
        }
          style={{
               width:"93%",
               height:'93%',
               backgroundColor: !playPermission ? '#808781' : !bgConnect ? '#8C3913' : '#0C3913',
               borderWidth: 2,
               borderColor: 'rgba(11, 2, 7, 0.2)',
               borderRadius: 100,
             }}>
               <View style={{flex:1,justifyContent: "center",alignItems: "center"}}>
              <Text adjustsFontSizeToFit={true} style={{textAlignVertical: "center", textAlign: "center"}}>{children({remainingTime})}</Text>
              </View>
            </TouchableHighlight>
        
        </>
        )
        }
        </CountdownCircleTimer>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  countdown:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
  }
});
