import React from "react";
import { Text, View, StyleSheet, Linking } from "react-native";
import { CheckBox } from "react-native-elements";
import { useTheme } from "react-native-paper";
export {
  Text,
  Title,
  Subheading,
  Paragraph,
  Headline,
  Caption,
} from "react-native-paper";

import { useDimensions } from "../hooks/device.hooks";

//* COMO UN H1 DE HTML
export const H1 = (props) => {
  const { style } = props;
  const { portrait: p, hp, wp } = useDimensions();
  return (
    <Text
      {...props}
      style={{ ...(style || {}), fontSize: p ? hp(4.5) : wp(4.5) }}
    />
  );
};

export const H2 = (props) => {
  const { style } = props;
  const {
    colors: { black },
  } = useTheme();
  const { portrait: p, hp, wp } = useDimensions();
  return (
    <Text
      {...props}
      style={{
        ...(style || {}),
        fontSize: p ? hp(3) : wp(3.5),
        alignSelf: "center",
        color: black,
      }}
    />
  );
};

export const H3 = (props) => {
  const { style } = props;
  const { portrait: p, hp, wp } = useDimensions();
  return (
    <Text
      {...props}
      style={{ ...(style || {}), fontSize: p ? hp(2.8) : wp(2.8) }}
    />
  );
};

//* COMPONENTE FOOTER, BASICAMENTE ES UN TEXTO CON UNAS PROPIEDADES
export const DevelopedBy = () => {
  const { portrait: p, hp, wp } = useDimensions();
  return (
    <View style={styles.byContainer}>
      <Text
        style={[
          styles.byText,
          { fontSize: p ? hp(2.5) : wp(2.5), marginBottom: hp(4) },
        ]}
      >
        Desarrollado por A&A Global Creations
      </Text>
    </View>
  );
};

export const Terms = ({ color }) => {
  const {
    colors: { primary },
  } = useTheme();

  return (
    <Text
      style={{ ...styles.termsLink, color: color || primary }}
      onPress={async () =>
        await Linking.openURL("https://taxizone.com.co/terminosdeuso.html")
      }
    >
      {" "}
      términos y condiciones
    </Text>
  );
};

export const Politics = ({ color }) => {
  const {
    colors: { primary },
  } = useTheme();

  return (
    <Text
      style={{ ...styles.termsLink, color: color || primary }}
      onPress={async () =>
        await Linking.openURL("https://taxizone.com.co/politicaprivacidad.html")
      }
    >
      {" "}
      políticas de privacidad
    </Text>
  );
};

export const TermsConditions = ({ checkState, setCheckState, navigation }) => {
  const {
    colors: { primary },
  } = useTheme();

  return (
    <View style={styles.termsContainer}>
      <View style={styles.termsContent}>
        <CheckBox
          checkedColor={primary}
          checked={checkState}
          containerStyle={{ marginRight: -10 }}
          onPress={() => setCheckState(!checkState)}
        />
        <Text style={styles.termsText}>
          Al registrarte estas aceptando las <Politics /> y
          <Terms /> de manipulación de datos. Puedes consultar esta información
          en cualquier momento.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  byContainer: {
    width: "100%",
    alignItems: "center",
  },
  byText: {
    color: "gray",
    textAlign: "center",
  },
  termsContainer: {
    alignSelf: "center",
    marginVertical: 15,
  },
  termsContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
  },
  termsText: {
    fontSize: 13,
    color: "grey",
    textAlign: "center",
  },
  termsLink: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
