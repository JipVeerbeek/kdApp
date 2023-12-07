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
  const [error, setError] = useState("");
  const [searchedCityCoordinates, setSearchedCityCoordinates] = useState(null);

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
      setThings(currentLocation);
      setError("Uw map is aan het laden");
    } catch (error) {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Geef ons toegang tot uw locatie");
      } else {
        try {
          let currentLocation = await Location.getCurrentPositionAsync({});
          setThings(currentLocation);
          setError("Uw map is aan het laden");
        } catch (error) {
          setError("Er gaat iets mis");
        }
      }
    }
  };

  const setThings = (currentLocation) => {
    setLocation(currentLocation);
    getCity(currentLocation.coords.latitude, currentLocation.coords.longitude);
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
          return;
        }
      }
    }
  };

  const getCoordinatesFromCityName = async (cityName) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          cityName
        )}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
      }
    } catch (error) {
      throw new Error("Error fetching coordinates:", error);
    }
    return null;
  };

  const inputRegion = async (text) => {
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
  
    if (foundCity) {
      try {
        const coordinates = await getCoordinatesFromCityName(foundCity);
        if (coordinates) {
          setSearchedCityCoordinates(coordinates);
        }
      } catch (error) {
        console.error('Error fetching searched city coordinates:', error);
      }
    } else {
      setSearchedCityCoordinates(null);
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <>
          {city && <Text style={styles.head1}>Uw locatie: {city}</Text>}
          {region && <Text style={styles.head2}>Uw regio: {region}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Zoek regio op plaatsnaam"
            onChangeText={handleInputChange}
            value={text}
            autoFocus={false}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {searchCity && searchRegion ? (
            <Text style={styles.head2}>
              De plaats {searchCity} bevindt zich in regio {searchRegion}
            </Text>
          ) : (
            <Text>&nbsp;</Text>
          )}
          <MapView
          style={styles.map}
          region={
            searchedCityCoordinates
              ? {
                  latitude: searchedCityCoordinates.latitude,
                  longitude: searchedCityCoordinates.longitude,
                  latitudeDelta: 0.7,
                  longitudeDelta: 0.7,
                }
              : {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.7,
                  longitudeDelta: 0.7,
                }
          }
          rotateEnabled={false}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          {searchedCityCoordinates ? (
            <Marker
              coordinate={searchedCityCoordinates}
              title={searchCity}
            />
          ) : (

          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="My Location"
          />
          )}
        </MapView>
        </>
      ) : (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  head1: {
    fontSize: 15,
    fontWeight: "bold",
    paddingTop: 15,
  },
  head2: {
    fontSize: 15,
    fontWeight: "bold",
    paddingTop: 5,
    paddingBottom: 15,
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
  map: {
    width: "90%",
    height: 400,
    paddingTop: 20,
  },
  error: {
    fontSize: 25,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    width: "60%",
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlign: "center",
  },
});

export default SettingsScreen;
