import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import regionsData from "./../regio.json";

const SettingsScreen = () => {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const [region, setRegion] = useState(null);
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (input) => {
    setText(input);
    determineRegion(city, input);
  };
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      getCity(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const getCity = async (latitude, longitude) => {
    try {
      let location = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (location && location.length > 0) {
        setCity(location[0].city);
        determineRegion(location[0].city);
      }
    } catch (error) {
      console.error("Error getting city:", error);
    }
  };

  const determineRegion = (place, text) => {
    console.log(text);
    for (const regio in regionsData) {
      const placesInRegion = regionsData[regio];
      for (const item of placesInRegion) {
        if (item.Plaats === text) {
          setRegion(regio);
          return;
        } else if (item.Plaats === place) {
          setRegion(regio);
          return;
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <>
          {city && <Text style={styles.heads}>Uw locatie: {city}</Text>}
          <Text>Handmatig de locatie instellen:</Text>
          <TextInput
            style={styles.input}
            placeholder="Plaatsnaam"
            onChangeText={handleInputChange}
            value={text}
            autoFocus={false}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {region && <Text style={styles.heads}>Uw regio: {region}</Text>}
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.7,
              longitudeDelta: 0.7,
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
        </>
      ) : (
        <Text style={styles.error}>Trying to get your location...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  heads: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 20,
    paddingBottom: 20,
  },
  map: {
    width: "90%",
    height: 400,
  },
  error: {
    fontSize: 25,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    width: "40%",
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default SettingsScreen;
