import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function MapScreen({ route }) {
  const [mapLink, setMapLink] = useState("");
  const [mapRegion, setMapRegion] = useState({
    latitude: 50.423,
    longitude: 30.383,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    route?.params?.paramKey && setMapLink(String(route?.params?.paramKey));
  }, [route]);

  return (
    <View style={styles.container}>
      <WebView source={{ uri: mapLink }} style={styles.map} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
