import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useTheme } from "react-native-paper";
export default ({ children }) => {
  const {
    colors: { primary },
  } = useTheme();

  return (
    <View style={[styles.plateContainer, { backgroundColor: primary }]}>
      <View style={[styles.plateContent, { backgroundColor: primary }]}>
        <Text style={styles.plateText}>{children}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  plateContainer: {
    padding: 3,
  },
  plateContent: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1.5,
    borderColor: "#000",
  },
  plateText: {
    fontWeight: "bold",
    color: "#000",
  },
});
