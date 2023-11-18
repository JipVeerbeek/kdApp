import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/home";
import SettingsScreen from "./screens/settings";
import VacationsScreen from "./screens/vacations";
import AppHeader from "./components/header";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Welkom"
        screenOptions={{
          tabBarStyle: { display: 'flex' },
          tabBarItemStyle: { justifyContent: 'center' },
          header: (props) => <AppHeader {...props} />,
        }}
      >
        <Tab.Screen
          name="Vacations"
          component={VacationsScreen}
          options={{ tabBarLabel: "Vacations" }}
        />
        <Tab.Screen
          name="Welkom"
          component={HomeScreen}
          options={{ tabBarLabel: "Home" }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ tabBarLabel: "Settings" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
