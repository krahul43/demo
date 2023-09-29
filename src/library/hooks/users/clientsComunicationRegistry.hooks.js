import React, { useEffect, Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRegisterForPushNotificationsAsync } from "../../utils/pushNotification.util";
import { setDriverApiAction } from "../../redux/actions/taxista/driverAction";
import useSetUserAvailability from "../../hooks/request/drivers/availability/useSetUserAvailability.hooks";
const useClientsCommunicationRegistry = () => {
  const [registerSubs, setRegisterSubs] = useState(null);
  const { driver } = useSelector(({ driverReducer }) => driverReducer);
  const registerForPushNotificationsAsync = useRegisterForPushNotificationsAsync();

  const registerPushNotificationRequest = async () => {
    await registerForPushNotificationsAsync();
  };
  useEffect(() => {
    if (driver?.user) setRegisterSubs(registerPushNotificationRequest());

    return async () => {
      if (registerSubs) {
        if (typeof registerSubs == "function") registerSubs();
        else if (registerSubs instanceof Promise) await registerSubs;
        setRegisterSubs(null);
      }
    };
  }, [driver?.user]);
};

export const useToggleDriverAvailability = () => {
  const { driver } = useSelector(({ driverReducer }) => driverReducer);
  const {
    user: { available },
  } = driver || { user: {} };
  const dispatch = useDispatch();
  const setUserAvailability = useSetUserAvailability();
  const toggleDriverAvailability = async (flag = null) => {
    try {
      const driverCopy = { ...(driver || { user: {} }) };
      if (flag == null) driverCopy.user.available = !available;
      else driverCopy.user.available = flag;
      dispatch(setDriverApiAction(driverCopy));
      await setUserAvailability(driverCopy.user.available);
    } catch (error) {
      console.error(error);
    }
  };

  return toggleDriverAvailability;
};

export const ClientCommunication = () => {
  useClientsCommunicationRegistry();
  return <Fragment />;
};
