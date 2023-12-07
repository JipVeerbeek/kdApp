import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function HomeScreen() {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Met deze app kunt u:</Text>
      <Text style={styles.content}>
        -{"\n"}
        Eenvoudig uw vakanties bekijken op basis van uw locatie of door een
        specifieke plaats in te stellen.
        {"\n"}-{"\n"}
        Ontdek de vakantieperiodes voor de regio's Noord, Midden en Zuid in
        Nederland.
        {"\n"}-{"\n"}
      </Text>
      {/* <Text>Selected City: {city}</Text>
      <Text>Selected Region: {region}</Text> */}
      <Image
        source={require("./../assets/schoolvakantie.jpg")}
        style={styles.homeImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  content: {
    fontSize: 18,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  homeImage: {
    width: 350,
    height: 350,
    borderRadius: 5,
  },
});
