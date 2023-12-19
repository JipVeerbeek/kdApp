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
          <Image
            source={require("./../assets/jipLogo.png")}
            style={styles.Image}
          />
          <Text style={styles.title}>Privacyverklaring</Text>
          <Text style={styles.content}>
            Onze organisatie hecht veel waarde aan de privacy van onze
            gebruikers. Deze privacyverklaring legt uit hoe we omgaan met de
            informatie die we verzamelen wanneer u onze diensten gebruikt, met
            inbegrip van hoe we omgaan met locatiegegevens.
          </Text>

          <Text style={styles.title}>Verzamelde informatie</Text>
          <Text style={styles.content}>
            Wanneer u onze diensten gebruikt, kunnen we bepaalde informatie
            verzamelen, waaronder persoonlijke gegevens zoals naam, e-mailadres
            en locatiegegevens.
          </Text>

          <Text style={styles.title}>Gebruik van locatiegegevens</Text>
          <Text style={styles.content}>
            We kunnen locatiegegevens verzamelen om u beter van dienst te kunnen
            zijn, bijvoorbeeld om u te voorzien van gepersonaliseerde inhoud,
            relevante informatie over onze diensten in uw regio, en om u te
            helpen bij het gebruik van functies die afhankelijk zijn van
            locatie.
          </Text>

          <Text style={styles.title}>Delen van informatie</Text>
          <Text style={styles.content}>
            We delen uw locatiegegevens niet met derden, tenzij dit noodzakelijk
            is om onze diensten te leveren of als we hier wettelijk toe
            verplicht zijn.
          </Text>

          <Text style={styles.title}>Beveiliging</Text>
          <Text style={styles.content}>
            We nemen passende maatregelen om uw informatie te beschermen tegen
            ongeautoriseerde toegang of openbaarmaking.
          </Text>

          <Text style={styles.title}>Uw keuzes</Text>
          <Text style={styles.content}>
            U heeft de mogelijkheid om de toegang tot locatiegegevens uit te
            schakelen via de instellingen van uw apparaat of onze diensten. Houd
            er rekening mee dat het uitschakelen van locatiegegevens sommige
            functies kan beperken.
          </Text>
          <Text style={styles.title}>©Jip Veerbeek 2023</Text>
        </View>
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
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center",
  },
  content: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 24,
  },
  Image: {
    marginTop: 10,
  },
});

export default AboutScreen;
