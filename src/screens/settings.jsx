import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import regionsData from "./../regio.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsScreen = ({ city, region, currentLocation }) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [searchCity, setSearchCity] = useState(null);
  const [searchRegion, setSearchRegion] = useState(null);
  const [searchedCityCoordinates, setSearchedCityCoordinates] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (city && region && currentLocation) {
      setReady(true);
    }
    loadStoredText();
  }, [city, region, currentLocation]);

  const handleInputChange = (input) => {
    setText(input);
    inputRegion(input);
    storeTextInAsyncStorage(input);
  };
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const loadStoredText = async () => {
    try {
      const storedText = await AsyncStorage.getItem("storedText");
      if (storedText !== null) {
        setText(storedText);
        inputRegion(storedText);
      } else {
        setText(null);
      }
    } catch (error) {
      console.log("Error loading stored text:", error);
    }
  };

  const storeTextInAsyncStorage = async (newText) => {
    try {
      await AsyncStorage.setItem("storedText", newText);
    } catch (error) {
      console.log("Error storing text:", error);
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
        console.log("Error fetching searched city coordinates:", error);
      }
    } else {
      setSearchedCityCoordinates(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {ready ? (
          <View style={styles.innerContainer}>
            {searchCity && searchRegion ? (
              <Text style={styles.head}>
                {searchCity} bevindt zich in regio {searchRegion}
              </Text>
            ) : (
              <Text style={styles.head}>Zoek uw schoolregio:</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Plaatsnaam"
              onChangeText={handleInputChange}
              value={text}
              autoFocus={false}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
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
            <View style={styles.locationInfo}>
              <View style={styles.locationItem}>
                <Text style={styles.locationTitle}>Uw locatie:</Text>
              </View>
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
        ) : (
          <View>
            <Text style={styles.loadTitle}>Even geduld a.u.b.</Text>
            <Text style={styles.loadContent}>Wij proberen uw locatie op te halen.</Text>
            <Text style={styles.loadError}>Check of wij toegang hebben tot uw locatie als dit te lang duurt.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 25,
  },
  head: {
    fontSize: 17,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  loadTitle: {
    fontSize: 15,
    paddingTop: 10,
    textAlign: "center",
  },
  loadContent: {
    fontSize: 13,
    paddingTop: 5,
    textAlign: "center",
  },
  loadError: {
    fontSize: 10,
    paddingTop: 5,
    textAlign: "center",
  },
  map: {
    width: "90%",
    height: 300,
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
    borderRadius: 5,
    textAlign: "center",
    marginBottom: 40,
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
  locationTitle: {
    fontSize: 13,
    fontWeight: "500",
    marginRight: 7,
    fontStyle: "italic",
  },
  locationValue: {
    fontSize: 12,
    fontStyle: "italic",
  },
  picker: {
    width: "40%",
    height: 50,
  },
});

export default SettingsScreen;
