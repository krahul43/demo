import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme, IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BorderInput } from "../../components/Input";
import { SubmitButton } from "../../components/Button";
import { useDimensions } from "../../hooks/device.hooks";
export default (props) => {
  const {
    myDirection,
    setMyDirection,
    reservationLoading,
    onSubmit,
    onTapLocation,
    notConnected,
    destination = null,
    setDestination,
    isFavorite = () => {},
    isConnected,
    onTapFavorites,
    comments,
    setComments,
    activeService,
    clientName,
    setClientName,
  } = props;
  const { portrait: p, wp, hp } = useDimensions();
  const {
    colors: { darkBrand, primary, red },
  } = useTheme();
  return (
    <>
      <View style={styles.paymentForm}>
        <View style={styles.rechargeStep}>
          <Text style={styles.stepText}>Donde estas ?</Text>
          <BorderInput
            containerStyle={{
              marginTop: 4,
            }}
            inputProps={{
              value: myDirection?.address,
              onChangeText: (text) =>
                setMyDirection({ ...myDirection, address: text }),
              multiline: true,
            }}
            trailing={
              <View style={styles.favoriteActionsRow}>
                <Icon
                  name="crosshairs-gps"
                  size={25}
                  onPress={() =>
                    !isConnected ? notConnected() : onTapLocation(1)
                  }
                  color={primary}
                  style={{ marginRight: 5 }}
                />
                {myDirection && (
                  <Icon
                    name={
                      isFavorite(myDirection?.address) ? "star" : "star-outline"
                    }
                    size={25}
                    color={
                      isFavorite(myDirection?.address) ? primary : darkBrand
                    }
                    onPress={() =>
                      !isConnected ? notConnected() : onTapFavorites(1)
                    }
                  />
                )}
              </View>
            }
          />
        </View>

        {destination && (
          <View style={styles.rechargeStep}>
            <Text style={styles.stepText}>Donde vas ?</Text>
            <BorderInput
              containerStyle={{
                marginTop: 4,
              }}
              inputProps={{
                placeholder: "Tu destino",
                value: destination?.address,
                onChangeText: (text) =>
                  setDestination({ ...destination, address: text }),
              }}
              leading={
                <Icon
                  name="close"
                  size={35}
                  onPress={() => {
                    setDestination(null);
                  }}
                  color={red}
                />
              }
              trailing={
                <View style={styles.favoriteActionsRow}>
                  <Icon
                    name="crosshairs-gps"
                    size={25}
                    onPress={() =>
                      !isConnected ? notConnected() : onTapLocation(2)
                    }
                    color={"black"}
                    style={{ marginRight: 5 }}
                  />
                  <Icon
                    name={
                      isFavorite(destination?.address) ? "star" : "star-outline"
                    }
                    size={25}
                    onPress={() =>
                      !isConnected ? notConnected() : onTapFavorites(2)
                    }
                    color={
                      isFavorite(destination?.address) ? primary : darkBrand
                    }
                  />
                </View>
              }
            />
          </View>
        )}

        <View style={styles.rechargeStep}>
          <Text style={styles.stepText}>Nombre del usuario</Text>
          <BorderInput
            containerStyle={{
              marginTop: 4,
            }}
            inputProps={{
              value: clientName,
              placeholder: "Jon Doe",
              onChangeText: (v) => setClientName(v),
            }}
            trailing={
              <View style={styles.favoriteActionsRow}>
                <Icon
                  name="account"
                  size={35}
                  color={darkBrand}
                  style={{ marginRight: 5 }}
                />
              </View>
            }
          />
        </View>

        <View style={styles.rechargeStep}>
          <Text style={styles.stepText}>Comentario</Text>
          <BorderInput
            containerStyle={{
              marginTop: 4,
            }}
            inputProps={{
              value: comments,
              onChangeText: (v) => setComments(v),
              placeholder: "Apartamento 204",
            }}
            trailing={
              <View style={styles.favoriteActionsRow}>
                <Icon
                  name="text"
                  size={35}
                  color={darkBrand}
                  style={{ marginRight: 5 }}
                />
              </View>
            }
          />
        </View>
        <SubmitButton
          buttonStyle={{ marginTop: hp(2) }}
          loading={reservationLoading}
          disabled={reservationLoading || activeService}
          onPress={() => (!isConnected ? notConnected() : onSubmit())}
          icon="check"
        >
          Reservar
        </SubmitButton>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 0,
    //flexGrow:1,
    marginHorizontal: 15,
    paddingBottom: 10,
  },
  title: {
    textAlign: "center",
    marginTop: 5,
    marginBottom: 0,
  },
  paymentForm: {
    marginTop: -5,
  },
  rechargeStep: {
    marginVertical: 10,
  },
  stepText: {
    color: "grey",
    fontSize: 16,
    fontStyle: "italic",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalizeHeaderView: {
    marginHorizontal: 15,
    paddingVertical: 15,
    borderBottomColor: "#aaa",
    borderBottomWidth: 1,
    borderRadius: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalizeHeaderText: {
    fontSize: 16,
    color: "#aaa",
    fontStyle: "italic",
  },
  modalizerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "black",
    borderRadius: 200,
  },
  modalizerButtonText: {
    color: "white",
  },
  favoriteActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activesTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  halfLine: {
    height: 1,
    backgroundColor: "gray",
    flex: 1,
  },
  activesTitle: {
    fontStyle: "italic",
    fontSize: 18,
  },
  activeRow: {
    paddingVertical: 12,
  },
  activeContainer: {
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  activeLabelContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    top: -17,
    left: 10,
    paddingHorizontal: 5,
    paddingVertical: 0,
    zIndex: 50,
  },
  activeLabelText: {
    fontStyle: "italic",
    fontWeight: "bold",
    fontSize: 16,
    paddingTop: 4,
  },
  activeDetails: {
    flex: 1,
  },
  activeActions: {
    // flexDirection:'row',
    // alignItems:'center'
  },
  stateView: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 100,
    marginTop: 5,
  },
  notesText: {
    color: "#5D6D7E",
    fontStyle: "italic",
    fontSize: 15,
  },
  clientText: {
    color: "black",
    fontStyle: "italic",
    fontSize: 15,
  },
  dateText: {
    color: "gray",
    fontStyle: "italic",
    fontSize: 13,
  },
  cancelActive: {
    padding: 2,
    // backgroundColor: "red",
    // borderRadius: 100,
  },
  infoContainer: {
    marginTop: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    //justifyContent:'center'
  },
  infoText: {
    fontStyle: "italic",
    fontSize: 15,
    marginLeft: 10,
  },
});
