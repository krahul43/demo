import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import AppContainerMap from "../../../../../library/components/AppContainerMap";
import ServiceDetail from "./ServiceDetail";
import {
  subscribeToChannel,
  openConnection,
  closeConnection,
} from "../../../../../library/socketIO";
export default function ServiceDetailView({ navigation, route }) {
  const [travelReservation, setTravelReservation] = useState(null);

  const activeService = useSelector(
    ({ activeServiceReducer }) => activeServiceReducer
  );
  const { driver } = useSelector(({ driverReducer }) => driverReducer);
  const { type: userType = "driver" } = driver?.user || {};
  const isDriver = userType == "driver";
  const isActiveServiceNew = travelReservation?.isNew || false;
  const screenParams = {
    back: true,
    backRoute: isDriver
      ? // if driver
        "Services"
      : // if client
        "UserHome",
  };
  const { back = false, backRoute } = route.params || screenParams;

  const registerListenerAndSubscriptions = () => {
    openConnection();
    subscribeToChannel(driver?.user?.id);
  };

  const setServiceCorrectly = () => {
    if (activeService) registerListenerAndSubscriptions();
    if (route?.params?.service || activeService) {
      if (route?.params?.service && activeService) {
        if (route?.params?.service?.id == activeService?.id)
          setTravelReservation(activeService);
      } else {
        if (route?.params?.service)
          setTravelReservation(route?.params?.service);
        else setTravelReservation(activeService);
      }
    }
  };

  useEffect(() => {
    setServiceCorrectly();

    const beforeRemoveSubscription = navigation.addListener(
      "beforeRemove",
      (e) => {
        e.preventDefault();
        console.log("before remove service detail");
        navigation.setParams(null);
        setTravelReservation(null);
        closeConnection();
        setTimeout(() => {
          navigation.dispatch(e.data.action);
        }, 200);
      }
    );

    return () => {
      setTravelReservation(null);
      beforeRemoveSubscription();
    };
  }, [route?.params?.service, activeService, navigation]);
  return (
    <AppContainerMap
      backRoute={backRoute}
      navigation={navigation}
      backButton={back}
      drawerMenu={false}
    >
      <ServiceDetail
        navigation={navigation}
        backRoute={backRoute}
        travelReservation={travelReservation}
        setTravelReservation={setTravelReservation}
        isActiveServiceNew={isActiveServiceNew}
        route={route}
        registerListenerAndSubscriptions={registerListenerAndSubscriptions}
      />
    </AppContainerMap>
  );
}
