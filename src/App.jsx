import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/home";
import AboutScreen from "./screens/about";
import SettingsScreen from "./screens/settings";
import VacationsScreen from "./screens/vacations";
import AppHeader from "./components/header";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Location from "expo-location";
import regionsData from "./regio.json";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabIcon = ({ name, focused }) => (
  <Icon
    name={name}
    size={focused ? 35 : 28}
    color={focused ? "black" : "gray"}
  />
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Start"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ header: (props) => <AppHeader {...props} /> }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Home() {
  const [city, setCity] = useState(null);
  const [region, setRegion] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      getLocation();
    } catch (error) {
      console.log("Error getting location:", error);
    }
  };

  const getLocation = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
      getCity(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.log("Error getting current location:", error);
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
          return;
        }
      }
    }
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: { display: "flex", height: 70 },
        tabBarItemStyle: { justifyContent: "center" },
        header: (props) => <AppHeader {...props} />,
        tabBarLabelStyle: { color: "black" },
      }}
    >
      <Tab.Screen
        name="Vacations"
        options={{
          tabBarLabel: "Vacations",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="suitcase" focused={focused} />
          ),
        }}
      >
        {(props) => <VacationsScreen {...props} city={city} region={region} />}
      </Tab.Screen>
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" focused={focused} />
          ),
        }}
      >
        {(props) => <HomeScreen {...props} city={city} region={region} />}
      </Tab.Screen>
      <Tab.Screen
        name="Settings"
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ focused }) => <TabIcon name="cog" focused={focused} />,
        }}
      >
        {(props) => (
          <SettingsScreen
            {...props}
            city={city}
            region={region}
            currentLocation={currentLocation}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
