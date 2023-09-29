import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import { useTheme } from "react-native-paper";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { hp, useDimensions } from "../hooks/device.hooks";

export default function MaintenanceModal(props) {
  const { show } = props;
  const {
    colors: { primary },
  } = useTheme();
  const { portrait: p, wp } = useDimensions();

  return (
    <Modal visible={show}>
      <TouchableOpacity style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image
            source={require("../../../assets/TAXIZONE2.png")}
            style={{ width: p ? wp(45) : wp(20), alignSelf: "center" }}
            resizeMode="contain"
          />
          <Text style={{ ...styles.title, color: "#000" }}>
            APLICACION EN MANTENIMIENTO
          </Text>
          <Icon
            name={"cellphone-information"}
            size={140}
            color={"black"}
            style={{ alignSelf: "center", marginVertical: 20 }}
          />
          <Text style={{ ...styles.body }}>
            Estamos realizando una actualizacion de la aplicacion para que
            puedas disfrutar de una mejor experiencia, por favor intenta
            ingresar mas tarde
          </Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    //justifyContent:'center',
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "100%",
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    fontStyle: "italic",
    width: "100%",
  },
  body: {
    fontSize: 16,
    textAlign: "justify",
    width: "100%",
    paddingVertical: 10,
  },
  optionsView: {
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  rowText: {
    fontSize: 16,
    marginLeft: 10,
  },
  actionsView: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cancelButton: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 5,
    backgroundColor: "black",
    width: "45%",
    borderRadius: 200,
  },
  confirmButton: {
    width: "45%",
    paddingVertical: 5,
    borderRadius: 4,
    borderRadius: 200,
  },
  buttonText: {
    fontSize: 17,
    textAlign: "center",
  },
});
