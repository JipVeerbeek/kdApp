import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const SettingsScreen = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        location && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.3,
              longitudeDelta: 0.3,
            }}
            rotateEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="My Location"
              description="This is my current location"
            />
          </MapView>
        )
      ) : (
        <Text style={styles.error}>Fix je settings maat</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
  },
  map: {
    // flex: 1,
    width: "100%",
    height: 300,
  },
  error: {
    fontSize: 30,
    fontWeight: "bold",
    color: "red",
  },
});

export default SettingsScreen;
