import React from "react";
import {
  ScrollView,
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Image,
} from "react-native";

const AboutScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.innerContainer}>
          <Text style={styles.content}>©Jip Veerbeek 2023</Text>
        </View>
        <Image
          source={require("./../assets/jipLogo.png")}
          style={styles.homeImage}
        />
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

  title: {
    fontSize: 24,
    fontWeight: "400",
    marginBottom: 20,
    textAlign: "center",
  },
  content: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 24,
  },
});

export default AboutScreen;
