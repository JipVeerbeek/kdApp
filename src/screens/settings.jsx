import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import MapView, { Marker } from "react-native-maps";
import regionsData from "./../regio.json";
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ city, region, currentLocation }) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [searchCity, setSearchCity] = useState(null);
  const [searchRegion, setSearchRegion] = useState(null);
  const [searchedCityCoordinates, setSearchedCityCoordinates] = useState(null);
  const [ready, setReady] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');


  useEffect(() => {
    // Check AsyncStorage for selectedRegion
    AsyncStorage.getItem('selectedRegion')
      .then((value) => {
        if (value) {
          // If a value exists in AsyncStorage, set selectedRegion
          setSelectedRegion(value);
        } else {
          // If AsyncStorage is empty, set default selectedRegion to 'noord'
          setSelectedRegion('noord');
          // Save 'noord' to AsyncStorage for future use
          AsyncStorage.setItem('selectedRegion', 'noord');
        }
        // Check if city, region, and currentLocation are available
        if (city && region && currentLocation) {
          // Set ready flag after determining selectedRegion and when city, region, and currentLocation are available
          setReady(true);
        }
      })
      .catch((error) => {
        console.error('Error reading AsyncStorage:', error);
      });
  }, [city, region, currentLocation]);
  


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

  const handleNewRegion = (region) => {
    setSelectedRegion(region);
    // Save selectedRegion to AsyncStorage
    AsyncStorage.setItem('selectedRegion', region)
      .catch((error) => {
        console.error('Error saving selectedRegion to AsyncStorage:', error);
      });
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
    <>
       {ready ? (
    <View style={styles.container}>
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
          <Picker
            selectedValue={selectedRegion}
            onValueChange={(itemValue) => handleNewRegion(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Noord" value="noord" />
            <Picker.Item label="Midden" value="midden" />
            <Picker.Item label="Zuid" value="zuid" />
          </Picker>
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
      <Text>Loading...</Text>
    </View>
     )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 25,
    paddingHorizontal: 10,
  },
  head: {
    fontSize: 17,
    fontWeight: "bold",
    paddingBottom: 10,
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
  locationValue: {
    fontSize: 12,
    fontStyle: "italic",
  },
  picker: {
    width: '40%',
    height: 50,
  },
});

export default SettingsScreen;
