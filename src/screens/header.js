import React from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
// import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function AppHeader() {
  // const navigation = useNavigation();

  // const handleIconPress = () => {
  //   Navigate to another screen
  //   navigation.navigate("AnotherScreen");
  // };

  return (
    <SafeAreaView>
      <StatusBar backgroundColor="black" />

      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.iconContainer}
          // onPress={console.log("press")}
        >
          <Icon name="question-circle-o" size={32} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Home</Text>
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