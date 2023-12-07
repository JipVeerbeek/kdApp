import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const HomeScreen = ({ city, region }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welkom bij de VakantieApp</Text>
      <Text style={styles.content}>
        Eenvoudig uw vakanties bekijken op basis van uw locatie of door een
        specifieke plaats in te stellen.{"\n\n"}
        Ontdek de vakantieperiodes voor de regio's Noord, Midden en Zuid in
        Nederland.
        {"\n"}
      </Text>
      <Image
        source={require("./../assets/schoolvakantie.jpg")}
        style={styles.homeImage}
      />
      <View style={styles.locationInfo}>
        <View style={styles.locationItem}>
          <Text style={styles.locationLabel}>Plaats:</Text>
          <Text style={styles.locationValue}>{city}</Text>
        </View>
        <View style={styles.locationItem}>
          <Text style={styles.locationLabel}>Regio:</Text>
          <Text style={styles.locationValue}>{region}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 40,
  },
  locationInfo: {
    alignSelf: "flex-end",
    marginTop: "auto",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  locationItem: {
    flexDirection: "row",
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginRight: 7,
  },
  locationValue: {
    fontSize: 12,
    fontStyle: "italic",
  },
  title: {
    fontSize: 24,
    fontWeight: "400",
    marginBottom: 20,
    textAlign: "center",
  },
  content: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 24,
  },
  homeImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginTop: 20,
  },
});

export default HomeScreen;
