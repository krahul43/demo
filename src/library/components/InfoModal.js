import React from "react";
import { View, StyleSheet, Text, Modal, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";

export default function InfoModal(props) {
  const {
    show,
    setShow,
    title,
    message,
    confirmAction,
    declineAction = true,
    children,
    loadingAcceptButton = false,
    contentStyle = {},
  } = props;
  const {
    colors: { primary, black },
  } = useTheme();

  return (
    <Modal visible={show} transparent={true} animationType={"slide"}>
      <TouchableOpacity style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: black }]}>{title}</Text>
          </View>
          <View style={styles.bodyContainer}>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.contentStyle}>{children}</View>
          </View>
          <View style={styles.actionsContainer}>
            {declineAction && (
              <TouchableOpacity
                style={{ ...styles.actionDeclineButton, borderColor: primary }}
                onPress={() => setShow(false)}
              >
                <Text style={styles.actionDeclineText}>Cancelar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{
                ...styles.actionConfirmButton,
                backgroundColor: loadingAcceptButton ? "gray" : primary,
              }}
              disabled={loadingAcceptButton}
              onPress={() => {
                setTimeout(() => confirmAction(), 500);
                // setShow(false);
              }}
            >
              <Text style={styles.actionConfirmText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 49,
  },
  modalContent: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    maxWidth: "90%",
    minWidth: "70%",
  },
  titleContainer: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
  },
  bodyContainer: {
    paddingVertical: 5,
  },
  message: {
    fontSize: 14,
  },
  actionsContainer: {
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    //marginTop: 100,
  },
  actionConfirmButton: {
    maxWidth: "50%",
    alignItems: "center",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
  },
  actionDeclineButton: {
    maxWidth: "50%",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  actionConfirmText: {
    color: "black",
  },
  actionDeclineText: {
    color: "black",
  },
});
