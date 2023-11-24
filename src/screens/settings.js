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
  const [searchCity, setSearchCity] = useState(null);
  const [searchRegion, setSearchRegion] = useState(null);

  const handleInputChange = (input) => {
    setText(input);
    inputRegion(input);
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

  const determineRegion = (place) => {
    for (const regio in regionsData) {
      const placesInRegion = regionsData[regio];
      for (const item of placesInRegion) {
        if (item.Plaats === place) {
          setRegion(regio);
          return; // Stop zodra de regio is gevonden
        }
      }
    }
  };

  const inputRegion = (text) => {
    console.log(text);
    let foundRegion = null;
    let foundCity = null;

    for (const regio in regionsData) {
      const placesInRegion = regionsData[regio];
      for (const item of placesInRegion) {
        if (item.Plaats.toLowerCase() === text.toLowerCase()) {
          foundRegion = regio;
          foundCity = item.Plaats;
          break;
        }
      }
      if (foundRegion) {
        break;
      }
    }

    setSearchRegion(foundRegion);
    setSearchCity(foundCity);

    if (!foundRegion && city) {
      for (const regio in regionsData) {
        const placesInRegion = regionsData[regio];
        for (const item of placesInRegion) {
          if (item.Plaats === city) {
            setRegion(regio);
            break;
          }
        }
        if (region) {
          break;
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <>
          {city && <Text style={styles.heads}>Uw locatie: {city}</Text>}
          {region && <Text style={styles.heads}>Uw regio: {region}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Regio op plaatsnaam"
            onChangeText={handleInputChange}
            value={text}
            autoFocus={false}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {searchCity && searchRegion && (
            <Text style={styles.heads}>
              De plaats {searchCity} bevind zich in regio {searchRegion}
            </Text>
          )}
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
    width: "50%",
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default SettingsScreen;
