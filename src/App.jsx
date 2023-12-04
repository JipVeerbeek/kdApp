import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/home";
import SettingsScreen from "./screens/settings";
import VacationsScreen from "./screens/vacations";
import AppHeader from "./components/header";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Location from "expo-location";

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused }) => (
  <Icon
    name={name}
    size={focused ? 35 : 28}
    color={focused ? "black" : "gray"}
  />
);

export default function App() {
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
    } catch (error) {
      console.log("Error getting location:", error);
    }
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Welkom"
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
          {(props) => <VacationsScreen {...props} />}
        </Tab.Screen>
        <Tab.Screen
          name="Welkom"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ focused }) => (
              <TabIcon name="home" focused={focused} />
            ),
          }}
        >
          {(props) => <HomeScreen {...props} />}
        </Tab.Screen>
        <Tab.Screen
          name="Settings"
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: ({ focused }) => (
              <TabIcon name="cog" focused={focused} />
            ),
          }}
        >
          {(props) => <SettingsScreen {...props} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
