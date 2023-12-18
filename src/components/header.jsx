import React from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import IconA from "react-native-vector-icons/AntDesign";

export default function AppHeader({ route, navigation }) {
  const { name } = route;
  if (name === "About") {
    return (
      <SafeAreaView>
        <StatusBar backgroundColor="black" />

        <View style={styles.headerContainer}>
          <TouchableOpacity>
            <IconA
              name="arrowleft"
              size={35}
              onPress={() => navigation.navigate("Home")}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>{name}</Text>
          <View style={styles.iconContainer} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <StatusBar backgroundColor="black" />

      <View style={styles.headerContainer}>
        <TouchableOpacity>
          <Icon
            name="question-circle-o"
            size={35}
            onPress={() => navigation.navigate("About")}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>{name}</Text>
        <View style={styles.iconContainer} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 35,
    alignItems: "center",
  },
  headerText: {
    color: "black",
    fontSize: 32,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
});
