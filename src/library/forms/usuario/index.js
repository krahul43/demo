import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useTheme, List } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Loading from "../../../library/components/Loading";
import { BorderInput } from "../../components/Input";
import { SubmitButton, FlatButton } from "../../components/Button";
import { ErrorMessage } from "../../components/Alert";
import { capitalize } from "../../utils/testFormat.util";
import { Modalize } from "react-native-modalize";
import { useDispatch } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";

import DirectionModalForm from "../../../library/forms/usuario/DirectionModalForm";
import InfoModal from "../../../library/components/InfoModal";
import AlertModal from "../../../library/components/AlertModal";

import { setInternetState } from "../../../library/redux/actions/internetAction";
import ServiceReservationForm from "./ServiceReservationForm";
import {
  getDirections,
  addDirection,
  removeDirection,
} from "../../networking/API";
import { useDimensions } from "../../hooks/device.hooks";

export default ({
  myDirection,
  setMyDirection,
  reservationLoading,
  reservationError,
  onSubmit,
  selectUbication,
  destination = null,
  setDestination,
  //setAddress,
  selectedInput,
  setSelectedInput,
  driver,
  comments,
  setComments,
  activeService,
}) => {
  const { portrait: p, wp, hp } = useDimensions();
  const modalizeRef = useRef();
  const dispatch = useDispatch();
  const { isConnected } = useNetInfo();

  const [showModalize, setShowModalize] = useState(false);
  const [favoriteDirections, setFavoriteDirections] = useState([]);
  const [favoriteSelected, setFavoriteSelected] = useState(null);
  const [showAddFavorite, setShowAddFavorite] = useState(false);
  const [showRemoveFavorite, setShowRemoveFavorite] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [favoriteError, setFavoriteError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const closeAlert = () => setShowAlert(false);

  const notConnected = () => dispatch(setInternetState(false));

  const getFavoriteDirecctions = async () => {
    try {
      const directions = await getDirections(driver?.token);
      setFavoriteDirections(directions);
    } catch (error) {
      setShowAlert(true);
      setFavoriteDirections([]);
    }
  };

  const isFavorite = (address) =>
    favoriteDirections
      ? favoriteDirections.some((item) => item.address == address)
      : false;

  const alreadyExist = (name) =>
    favoriteDirections.some(
      (item) => item.name.toLowerCase() == name.toLowerCase()
    );

  const onTapLocation = (input) => {
    setSelectedInput(input);
    setShowModalize(true);
    modalizeRef.current.open();
  };

  const onTapFavorites = (input) => {
    setSelectedInput(input);
    isFavorite(myDirection?.address)
      ? setShowRemoveFavorite(true)
      : setShowAddFavorite(true);
  };

  const addFavoriteDirection = async (name) => {
    if (alreadyExist(name)) {
      setFavoriteError(true);
    } else {
      const address =
        selectedInput == 1 ? myDirection?.address : destination?.address;
      const coords =
        selectedInput == 1
          ? JSON.stringify(myDirection?.coords)
          : JSON.stringify(destination?.coords);
      const favoriteAddress = new FormData();
      favoriteAddress.append("name", name);
      favoriteAddress.append("address", address);
      favoriteAddress.append("coords", coords);

      try {
        const apiResponse = await addDirection(driver?.token, favoriteAddress);
        if (selectedInput == 1)
          setMyDirection({
            ...apiResponse,
            coords: JSON.parse(apiResponse.coords),
          });
        else
          setDestination({
            ...apiResponse,
            coords: JSON.parse(apiResponse.coords),
          });
        setRefresh(!refresh);
        setShowAddFavorite(false);
      } catch (error) {
        setShowAlert(true);
        setShowAddFavorite(false);
      }
    }
  };

  const removeFavoriteDirection = async () => {
    try {
      const addressId = selectedInput == 1 ? myDirection?.id : destination?.id;
      await removeDirection(driver?.token, addressId);
      setRefresh(!refresh);
      setShowRemoveFavorite(false);
    } catch {
      setShowAlert(true);
      setShowRemoveFavorite(false);
    }
  };

  useEffect(() => {
    getFavoriteDirecctions();
  }, [refresh]);

  useEffect(() => {
    if (!showModalize && favoriteSelected) {
      if (selectedInput == 1) {
        setMyDirection({
          ...favoriteSelected,
          coords: JSON.parse(favoriteSelected.coords.replace("\\", "")),
        });
      } else {
        setDestination({
          ...favoriteSelected,
          coords: JSON.parse(favoriteSelected.coords.replace("\\", "")),
        });
      }
    }
  }, [showModalize]);
  const {
    colors: { darkBrand, primary, red },
  } = useTheme();
  return (
    <>
      <ScrollView style={styles.container}>
        <ServiceReservationForm
          {...{
            myDirection,
            setMyDirection,
            reservationLoading,
            onSubmit,
            destination,
            setDestination,
            driver,
            comments,
            setComments,
            activeService,
            onTapLocation,
            onTapFavorites,
            isFavorite,
            notConnected,
          }}
        />

        {reservationError != null && (
          <ErrorMessage reload={reservationError}>
            {reservationError}
          </ErrorMessage>
        )}
      </ScrollView>
      <DirectionModalForm
        showModal={showAddFavorite}
        setShowModal={setShowAddFavorite}
        onConfirm={addFavoriteDirection}
        error={favoriteError}
        setError={setFavoriteError}
      />
      <InfoModal
        show={showRemoveFavorite}
        setShow={setShowRemoveFavorite}
        title={"Aviso"}
        message={"Estas seguro de eliminar esta direccion de tus favoritos?"}
        declineAction={true}
        confirmAction={removeFavoriteDirection}
      />
      <Loading
        isVisible={modalizeRef.current == null || favoriteDirections == null}
        hasText={false}
      />
      <AlertModal
        isVisible={showAlert}
        text={"Ocurrio un error, por favor verifica tu conexion a internet"}
        icon={"information"}
        closeFunction={closeAlert}
      />
      <Modalize
        ref={modalizeRef}
        snapPoint={200}
        modalTopOffset={hp(15)}
        HeaderComponent={() => (
          <View style={styles.modalizeHeaderView}>
            <Text style={styles.modalizeHeaderText}>
              {selectedInput == 1 ? "¿Donde estas?" : "¿A donde te diriges?"}
            </Text>
            <FlatButton
              onPress={() => {
                modalizeRef.current.close();
                setTimeout(() => {
                  selectUbication();
                }, 200);
              }}
              containerStyle={styles.modalizerButton}
              text={"Mapa"}
              textStyle={styles.modalizerButtonText}
              icon={
                <Icon name={"map-search-outline"} color={"white"} size={20} />
              }
              text="Fijar en mapa"
            />
          </View>
        )}
        flatListProps={{
          data: favoriteDirections,
          renderItem: ({ item, index }) => (
            <List.Item
              titleStyle={{ fontWeight: "bold", fontSize: 17 }}
              title={capitalize(item.name)}
              onPress={() => {
                setFavoriteSelected(item);
                setShowModalize(false);
                modalizeRef.current.close();
              }}
              description={capitalize(item.address)}
              left={(props) => (
                <List.Icon {...props} icon="star" color={"#F2B215"} />
              )}
            />
          ),
          keyExtractor: (item) => item.id.toString(),
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    paddingBottom: 10,
    flex: 1,
  },
  title: {
    textAlign: "center",
    marginVertical: 10,
  },
  paymentForm: {
    marginVertical: 10,
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
});
