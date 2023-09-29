import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Linking,
  Modal,
  StyleSheet,
} from "react-native";

import { useDimensions } from "../hooks/device.hooks";
import { goToGoogleMaps, goToWaze, goToIosMaps } from "../utils/mapUtils";

export default function ModalMaps(props) {
  const { showModal, setShowModal, coords } = props;
  const { portrait: p, wp } = useDimensions();

  const [isWazeAvailable, setIsWazeAvailable] = useState(false);

  const checkAppsInstalled = async () => {
    //! VERIFICA SI WAZE ESTA INSTALADA
    const wazeInstalled = await Linking.canOpenURL("waze://");
    setIsWazeAvailable(wazeInstalled);
  };

  useEffect(() => {
    checkAppsInstalled();
  }, []);

  return (
    <Modal visible={showModal} animationType={"slide"} transparent={true}>
      <TouchableOpacity
        style={styles.modalContainer}
        onPress={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={[styles.modalContent, { width: p ? wp(80) : wp(45) }]}
          onPress={() => {}}
        >
          <View style={styles.modalTitle}>
            <Text style={styles.modalText}>Completar accion usando</Text>
          </View>
          <View style={styles.optionsRow}>
            {isWazeAvailable ? (
              <TouchableOpacity
                style={{ width: "30%" }}
                onPress={() => {
                  setShowModal(false);
                  goToWaze(coords);
                }}
              >
                <Image
                  source={require("../../../assets/waze.png")}
                  resizeMode={"contain"}
                  style={{ width: "100%", height: p ? 75 : 90 }}
                />
                <Text style={styles.sourceText}>Waze</Text>
              </TouchableOpacity>
            ) : (
              <>
                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    style={{ width: "30%" }}
                    onPress={() => {
                      setShowModal(false);
                      goToIosMaps(coords);
                    }}
                  >
                    <Image
                      source={require("../../../assets/ios-maps.png")}
                      resizeMode={"contain"}
                      style={{ width: "100%", height: p ? 60 : 90 }}
                    />
                    <Text style={styles.sourceText}>IOS Maps</Text>
                  </TouchableOpacity>
                )}
                {Platform.OS === "android" && (
                  <TouchableOpacity
                    style={{ width: "30%" }}
                    onPress={() => {
                      goToGoogleMaps(coords);
                      setShowModal(false);
                    }}
                  >
                    <Image
                      source={require("../../../assets/google-maps.png")}
                      resizeMode={"contain"}
                      style={{ width: "100%", height: p ? 75 : 90 }}
                    />
                    <Text style={styles.sourceText}>Google Maps</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: "#F2B215",
    borderWidth: 2,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
    width: "70%",
  },
  modalTitle: {
    borderBottomColor: "#F2B215",
    borderBottomWidth: 2,
  },
  modalText: {
    fontSize: 18,
    marginVertical: 15,
  },
  sourceText: {
    fontSize: 14,
    textAlign: "center",
  },
});
