import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { detailItems } from '../mockedData/mockedData';
import Header from "../components/Header";
import DetailItem from "../components/DetailItem";

export default function DetailsScreen({ navigation }) {

    return (
        <View style={styles.container}>
        <Header navigation={navigation} />
        <ScrollView style={styles.list}>
        <Text style={styles.list__title}>Details</Text>
        <View style={styles.list__items}>
          {Array(5)
            .fill(detailItems)
            .flat()
            .map(({text, detail}, index) => (
              <DetailItem key={index} text={text} detail={detail} />
            ))}
        </View>
      </ScrollView>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#7fcf7e",
    },
    list: {
      marginTop: 15,
      paddingHorizontal: 20,
    },
    list__title: {
      fontSize: 24,
      fontWeight: "bold",
    },
    list__items: {
      marginTop: 20,
    },
  });