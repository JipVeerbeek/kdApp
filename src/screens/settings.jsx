import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import MapView, { Marker } from "react-native-maps";
import regionsData from "./../regio.json";

const SettingsScreen = ({ city, region, currentLocation }) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [searchCity, setSearchCity] = useState(null);
  const [searchRegion, setSearchRegion] = useState(null);
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
      {currentLocation ? (
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
                  latitude: currentLocation.coords.latitude,
                  longitude: currentLocation.coords.longitude,
                  latitudeDelta: 0.7,
                  longitudeDelta: 0.7,
                }
          }
          rotateEnabled={false}
          scrollEnabled={false}
          zoomEnabled={false}
          showsCompass={false}
          pitchEnabled={false}
          toolbarEnabled={false}
        >
          {searchedCityCoordinates ? (
            <Marker
              coordinate={searchedCityCoordinates}
              title={searchCity}
            />
          ) : (

          <Marker
            coordinate={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            }}
            title="My Location"
          />
          )}
        </MapView>
        </>
      ) : (
        <Text style={styles.error}>Er is iets mis gegaan met het ophalen van uw locatie</Text>
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
