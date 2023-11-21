import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/home";
import SettingsScreen from "./screens/settings";
import VacationsScreen from "./screens/vacations";
import AppHeader from "./components/header";
import Icon from "react-native-vector-icons/FontAwesome";

const Tab = createBottomTabNavigator();

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
          component={VacationsScreen}
          options={{
            tabBarLabel: "Vacations",
            tabBarIcon: ({ focused }) => (
              <TabIcon name="suitcase" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Welkom"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ focused }) => (
              <TabIcon name="home" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: ({ focused }) => (
              <TabIcon name="cog" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
