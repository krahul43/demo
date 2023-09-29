import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  BackHandler,
  AppState,
  StyleSheet,
} from "react-native";
import DriverCard from "./DriverCard";
import ClientCard from "./ClientCard";
import { useTheme } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import DriversServiceDetailsForm from "./DriversServiceDetailsForm";
import ClientsServiceDetailsForm from "./ClientDetail";
import ClientsServiceFinishedDetailsForm from "./ClientsServiceDetailsForm";
import CancelServiceModal from "../../../../../library/components/CancelServiceModal";
import MapsModal from "../../../../../library/components/MapsModal";
import InfoModal from "../../../../../library/components/InfoModal";
import { closeConnection } from "../../../../../library/socketIO";
import useTravelReservationService from "../../../../../library/hooks/request/drivers/travelReservation/useTravelReservationService.hooks";
import useLoadUserInfo from "../../../../../library/hooks/request/drivers/travelReservation/useLoadDriverInfo.hooks";
import useEvaluateService from "../../../../../library/hooks/request/drivers/travelReservation/useEvaluateService.hooks";
import useDriverAtPlaceTravelReservationsService from "../../../../../library/hooks/request/drivers/travelReservation/useDriverAtPlaceTravelReservationsService.hooks";
import useFinishTravelReservationsService from "../../../../../library/hooks/request/drivers/travelReservation/useFinishTravelReservationsService.hooks";
import useCancelTravelReservationsService from "../../../../../library/hooks/request/drivers/travelReservation/useCancelTravelReservationsService.hooks";
import useSubscribeClientToTravelReservationTaken from "../../../../../library/hooks/SocketListeners/clients/useSubscribeClientToTravelReservationTaken.hooks";
import useSubscribeClientToTravelReservationDriverAtPlace from "../../../../../library/hooks/SocketListeners/clients/useSubscribeClientToTravelReservationDriverAtPlace.hooks";
import useSubscribeClientToTravelReservationFinished from "../../../../../library/hooks/SocketListeners/clients/useSubscribeClientToTravelReservationFinished.hooks";
import useSubscribeClientToTavelReservationCanceled from "../../../../../library/hooks/SocketListeners/clients/useSubscribeClientToTavelReservationCanceled.hooks";
import useSubscribeClientToTavelReservationETA from "../../../../../library/hooks/SocketListeners/clients/useSubscribeClientToTavelReservationETA.hooks";
import { useToggleDriverAvailability } from "../../../../../library/hooks/users/driversComunicationRegistry.hooks";
import { useCurrentLocationRegister } from "../../../../../library/hooks/location.hooks";
import { setActiveServiceAction } from "../../../../../library/redux/actions/activeService.action";
import moment from "../../../../../library/utils/moment";
import { getCancelOptions } from "../../../../../library/networking/API";
import NetInfo from "@react-native-community/netinfo";
export default ({
  navigation,
  backRoute,
  setTravelReservation,
  travelReservation,
  isActiveServiceNew,
  route,
  registerListenerAndSubscriptions,
}) => {
  const {
    colors: { primary },
  } = useTheme();
  const [
    serviceEvaluationRequestListener,
    setServiceEvaluationRequestListener,
  ] = useState(false);
  const dispatch = useDispatch();
  const [timeoutCanceled, setTimeoutCanceled] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [cancelOptions, setCancelOptions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [refreshTimeout, setRefreshTimeout] = useState(null);
  const [finished, setFinished] = useState(false);
  const [atPlaceLoading, setAtPlaceLoading] = useState(false);
  const [finishLoading, setFinishLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coords, setCoords] = useState(null);
  const driverAtPlace = useDriverAtPlaceTravelReservationsService();
  const finishService = useFinishTravelReservationsService();
  const {
    loading: loadTravelReservationLoading,
    error: loadTravelReservationError,
    loadTravelReservation,
  } = useTravelReservationService();
  const toggleDriverAvailability = useToggleDriverAvailability();

  const { driver } = useSelector(({ driverReducer }) => driverReducer);
  const {
    type: userType = "driver",
    id: user_id,
    available,
  } = driver?.user || {};
  const isDriver = userType == "driver";
  const {
    isNew,
    id: trId,
    driver_id,
    finished_at = null,
    canceled_at = null,
  } = travelReservation || {};
  const isServiceOver = finished_at != null || canceled_at != null;
  const activeTravelReservation = useSelector(
    ({ activeServiceReducer }) => activeServiceReducer
  );
  const userLocationReducer = useSelector(
    ({ userLocationReducer }) => userLocationReducer
  );
  const updateUserLocation = useCurrentLocationRegister();
  const {
    loading: loadDriverInfoLoading,
    error: loadDriverInfoError,
    loadDriverInfo,
  } = useLoadUserInfo();
  const {
    error: evaluateServiceError,
    evaluateSevice,
    loading: evaluateServiceLoading,
  } = useEvaluateService();
  const {
    loading: loadingCancelTravelReservations,
    error: errorCancelTravelReservations,
    canceled,
    cancelTravelReservations,
    setCanceled,
  } = useCancelTravelReservationsService();
  const navigateToClientCoords = () => {
    const { client_coords } = travelReservation;
    setCoords(client_coords);
    setShowModal(true);
  };

  const evaluationRequest = async (rateEvaluation, comments = "") => {
    try {
      if (rateEvaluation != 0) {
        if (!isDriver) {
          await evaluateSevice(travelReservation?.id, {
            driver_stars_rating: rateEvaluation,
            driver_comments: comments,
          });
          redirection();
        } else {
          await evaluateSevice(travelReservation?.id, {
            client_stars_rating: rateEvaluation,
            client_comments: comments,
          });
          redirection();
        }
      } else {
        redirection();
      }
    } catch (error) {
      console.error("evaluation request error", error);
    }
  };

  const navigateToDestinationCoords = () => {
    const { destination_coords } = travelReservation;
    if (typeof destination_coords == "string") {
      setCoords(destination_coords);
      setShowModal(true);
    }
  };

  const setActiveServiceInStore = (t) => dispatch(setActiveServiceAction(t));
  // setActiveServiceInStore(null);
  // Starts driver functions

  const getCancelOptionsAsync = async () => {
    const { options } = await getCancelOptions(driver?.token);
    setCancelOptions(options);
  };

  const loadActiveService = async () => {
    try {
      const { id, code } = travelReservation || {};
      if (
        isNew &&
        id &&
        !loadingCancelTravelReservations &&
        !loadTravelReservationLoading
      ) {
        registerListenerAndSubscriptions();
        const tr = await loadTravelReservation(id);
        setTravelReservation({ ...tr, isNew });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const atClientPlace = async () => {
    try {
      const { id } = travelReservation;
      setAtPlaceLoading(true);
      const res = await driverAtPlace(id);
      setTravelReservation({
        ...travelReservation,
        driver_on_pickup_place_at: moment().format(),
      });
      updateUserLocation();
      setAtPlaceLoading(false);
    } catch (error) {
      setAtPlaceLoading(false);
    }
  };

  const finishTravelService = async () => {
    try {
      const { id } = travelReservation;
      setFinishLoading(true);
      const res = await finishService(id);
      if (travelReservation?.client_id) {
        setFinishLoading(false);
        setTravelReservation({
          ...travelReservation,
          finished_at: moment().format(),
        });
      } else {
        setFinishLoading(false);
        toggleDriverAvailability(true);
        setTravelReservation(null);
        setActiveServiceInStore(null);
        navigation.navigate("Services");
      }
    } catch (error) {
      console.error(error);
      setFinishLoading(false);
    }
  };
  // Ends driver functions

  // #######################

  const cancelService = async () => {
    try {
      const { id } = travelReservation;
      setCanceled(true);
      const res = await cancelTravelReservations(id);
      setTimeout(() => {
        setTravelReservation(null);
        setActiveServiceInStore(null);
        setCanceled(false);
        setTimeoutCanceled(false);
        navigation.navigate(backRoute, { reset: true });
      }, 1800);
    } catch (error) {
      console.error(error);
      setCanceled(false);
    }
  };

  const redirection = async () => {
    try {
      setTravelReservation(null);
      setActiveServiceInStore(null);
      setTimeout(() => {
        setCanceled(false);
        setTimeoutCanceled(false);
        setFinished(false);
        setServiceEvaluationRequestListener(false);
        if (isDriver) toggleDriverAvailability(true);
        navigation.navigate(backRoute, { reset: true });
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  // Starts client function
  const loadDriverInfoRequest = async () => {
    const driverInfo = await loadDriverInfo(travelReservation.driver_id);
    setTravelReservation({ ...travelReservation, driverInfo });
  };

  const loadClientInfoRequest = async () => {
    const clientInfo = await loadDriverInfo(travelReservation.client_id);
    setTravelReservation({ ...travelReservation, clientInfo });
  };
  // Ends client functions

  // socket listeners
  useSubscribeClientToTravelReservationTaken(
    travelReservation,
    (travelReservationId) => {
      console.log("taken", { travelReservationId });
      const { id } = travelReservation || {};
      if (travelReservationId == id) {
        loadActiveService();
        //console.log(travelReservation);
      }
    }
  );

  useSubscribeClientToTravelReservationDriverAtPlace(
    travelReservation,
    (travelReservationId) => {
      const { id } = travelReservation || {};
      if (travelReservationId == id)
        setTravelReservation({
          ...travelReservation,
          driver_on_pickup_place_at: moment().format(),
        });
    }
  );

  useSubscribeClientToTravelReservationFinished(
    travelReservation,
    (travelReservationId) => {
      const { id } = travelReservation || {};
      if (travelReservationId == id) {
        setTravelReservation({
          ...travelReservation,
          finished_at: moment().format(),
        });
      }
    }
  );

  useSubscribeClientToTavelReservationCanceled(
    travelReservation,
    (travelReservationId) => {
      const { id } = travelReservation || {};
      if (travelReservationId == id && !canceled) {
        setTravelReservation({
          ...travelReservation,
          canceled_at: moment().format(),
        });
      }
    }
  );

  useSubscribeClientToTavelReservationETA(
    travelReservation,
    ({ travelReservationId, eta }) => {
      const { id } = travelReservation || {};
      if (travelReservationId == id) {
        setTravelReservation({
          ...travelReservation,
          eta: eta,
        });
      }
    }
  );

  const formProps = {
    travelReservation,
    navigateToClientCoords,
    navigateToDestinationCoords,
    atClientPlace,
    atPlaceLoading,
    finishLoading,
    finishTravelService,
    isNew,
    isDriver,
    loadingCancelTravelReservations,
    errorCancelTravelReservations,
    cancelService,
    canceled,
    loadTravelReservationError,
    isDriver,
    driver,
    setTravelReservation,
    loadActiveService,
    loadDriverInfoLoading,
    loadDriverInfoError,
    userLocationReducer,
    setShowCancelConfirmation,
  };
  const onPageFocus = (state) => {
    if (state == "active") loadActiveService();
  };

  useEffect(() => {
    if (
      activeTravelReservation &&
      !travelReservation &&
      !route?.params?.service
    ) {
      setTravelReservation(activeTravelReservation);
      setTimeout(() => loadActiveService(), 250);
    } else if (!activeTravelReservation) {
      setTravelReservation(null);
    }
  }, [activeTravelReservation, route?.params?.service]);

  useEffect(() => {
    getCancelOptionsAsync();
    loadActiveService();
    const focusSubsription = navigation.addListener("focus", () => {
      loadActiveService();
    });

    return () => {
      closeConnection();
      focusSubsription();

      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
        setRefreshTimeout(null);
      }
    };
  }, []);

  useEffect(() => {
    if (travelReservation) {
      if (travelReservation.isNew) {
        if (travelReservation.finished_at) {
          setFinished(true);
          AppState.removeEventListener("change", onPageFocus);
        } else if (travelReservation.canceled_at) {
          if (isDriver) toggleDriverAvailability(true);
          setTimeoutCanceled(true);
          setTravelReservation(null);
          setActiveServiceInStore(null);
          AppState.removeEventListener("change", onPageFocus);
          setTimeout(() => {
            setTimeoutCanceled(false);
            navigation.navigate(backRoute, { reset: true });
          }, 1000);
        } else {
          registerListenerAndSubscriptions();
          setActiveServiceInStore(travelReservation);
          AppState.addEventListener("change", onPageFocus);
        }
      }
    }
    return () => AppState.removeEventListener("change", onPageFocus);
  }, [travelReservation]);

  useEffect(() => {
    if (travelReservation) {
      // check if i am really the driver who took this service
      if (travelReservation.isNew && travelReservation.driver_id && user_id) {
        if (typeof travelReservation.driver_id != "undefined") {
          if (isDriver && user_id != travelReservation.driver_id) {
            setTimeoutCanceled(true);
            setTravelReservation(null);
            setActiveServiceInStore(null);
            toggleDriverAvailability(true);
            setTimeout(() => {
              setTimeoutCanceled(false);
              navigation.navigate(backRoute, { reset: true });
            }, 1000);
          }
        }
      }
      // check if the driver info was loaded
      if (
        !isDriver &&
        travelReservation.driver_id &&
        !travelReservation.driverInfo
      ) {
        loadDriverInfoRequest();
      } else if (
        isDriver &&
        travelReservation.client_id &&
        !travelReservation.clientInfo
      ) {
        loadClientInfoRequest();
      }
    }
  }, [travelReservation]);

  useEffect(() => {
    const netInfoSubscription = NetInfo.addEventListener((state) => {
      if (state.isConnected) loadActiveService();
    });

    const backHandlerSubscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isDriver) navigation.navigate("Services");
        else navigation.navigate("UserHome");
      }
    );
    return () => {
      backHandlerSubscription.remove();
      netInfoSubscription();
    };
  }, [navigation]);

  return (
    <>
      {travelReservation &&
      !loadTravelReservationLoading &&
      !loadingCancelTravelReservations ? (
        <>
          {isDriver ? (
            <DriversServiceDetailsForm {...formProps} />
          ) : (
            <>
              {isServiceOver ? (
                <ClientsServiceFinishedDetailsForm {...formProps} />
              ) : (
                <ClientsServiceDetailsForm {...formProps} />
              )}
            </>
          )}
        </>
      ) : (
        <ActivityIndicator
          size="large"
          color={primary}
          style={{ marginTop: 50 }}
        />
      )}

      {/* {cancelOptions && (
        <CancelServiceModal
          options={cancelOptions}
          showModal={showCancelConfirmation}
          setShowModal={setShowCancelConfirmation}
          onConfirm={() => {
            cancelService();
            setShowCancelConfirmation(false);
          }}
        />
      )} */}

      <InfoModal
        show={timeoutCanceled && (!canceled || isDriver)}
        setShow={setTimeoutCanceled}
        title={"Servicio cancelado"}
        message={
          !isDriver
            ? "Tu servicio no pudo ser asignado a un conductor por falta de disponibilidad, por lo tanto, se ha cancelado"
            : null
        }
        declineAction={false}
        confirmAction={redirection}
      />

      <InfoModal
        show={finished && travelReservation != null}
        setShow={setFinished}
        title={"Servicio Finalizado"}
        declineAction={false}
        confirmAction={() => {
          setServiceEvaluationRequestListener(true);
        }}
        loadingAcceptButton={evaluateServiceLoading}
        // contentSyle={{ width: "100%", height: "32%" }}
      >
        {isDriver ? (
          <ClientCard
            travelReservation={travelReservation}
            evaluate={true}
            userLocationReducer={userLocationReducer}
            requestCallback={evaluationRequest}
            requestListener={serviceEvaluationRequestListener}
            showDistance={false}
          />
        ) : (
          <DriverCard
            travelReservation={travelReservation}
            evaluate={true}
            userLocationReducer={userLocationReducer}
            showDistance={travelReservation?.driver_on_pickup_place_at == null}
            requestCallback={evaluationRequest}
            requestListener={serviceEvaluationRequestListener}
          />
        )}
      </InfoModal>

      <MapsModal
        showModal={showModal}
        setShowModal={setShowModal}
        coords={coords}
      />
    </>
  );
};

const styles = StyleSheet.create({
  boldText: {
    fontSize: 17,
    fontWeight: "bold",
  },
});
