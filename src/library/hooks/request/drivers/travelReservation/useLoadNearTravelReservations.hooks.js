import { useSelector, useDispatch } from "react-redux";
import { apiCall } from "../../../../networking/API";
import {
  setTravelReservationsAction,
  setTravelReservationsLoadingAction,
} from "../../../../redux/actions/taxista/travelReservations/nearTravelReservationsAction";
import { verifyConnection } from "../../../../utils/wifiConnection.util";
import { setNearServicesToAsyncStorage } from "../../../../utils/syncStorage.utils";
export default () => {
  const {
    driverReducer: {
      driver: {
        token,
        user: {
          available,
          Zone: { code: zone_code },
        },
      },
    },
    nearTravelReservationsReducer: { loading: loadingNearTravelReservations },
  } = useSelector(({ driverReducer, nearTravelReservationsReducer }) => ({
    driverReducer,
    nearTravelReservationsReducer,
  }));
  const userLocation = useSelector(
    ({ userLocationReducer }) => userLocationReducer
  );

  const dispatch = useDispatch();

  const setTravelReservations = (travelReservations) =>
    dispatch(setTravelReservationsAction(travelReservations));

  const setTravelReservationsLoading = (loading) =>
    dispatch(setTravelReservationsLoadingAction(loading));

  const getTravelReservations = async () => {
    const { coords } = userLocation || { coords: {} };
    const { latitude, longitude } = coords || {};
    if (loadingNearTravelReservations || !latitude || !longitude) return;
    if (!available) {
      setTravelReservationsLoading(false);
      setTravelReservations([]);
      return;
    }
    console.log("getTravelReservations");

    setTravelReservationsLoading(true);
    console.log(
      "travelsUrl",
      `/api/travel-reservation/near-driver/${zone_code}/${latitude}/${longitude}`
    );
    try {
      if (!verifyConnection() || !zone_code || !latitude || !longitude) return;
      const { data: travels } = await apiCall(
        `/api/travel-reservation/near-driver/${zone_code}/${latitude}/${longitude}`,
        null,
        {
          "taxi-zone-access-token": token,
        }
      );
      console.log({ travels });
      setTravelReservations(travels);
      setNearServicesToAsyncStorage(travels.map(({ id }) => id));
      setTravelReservationsLoading(false);
    } catch (error) {
      setTravelReservationsLoading(false);
      console.error(error);
    }
  };

  return getTravelReservations;
};

export const getTravelsId = ({ token, userLocation, zone_code }) =>
  new Promise(async (resolve, reject) => {
    const { latitude, longitude } = userLocation || {};

    try {
      if (!verifyConnection(false) || !zone_code || !latitude || !longitude)
        return;
      const { data } = await apiCall(
        `/api/travel-reservation/id-near-driver/${zone_code}/${latitude}/${longitude}`,
        null,
        {
          "taxi-zone-access-token": token,
        }
      );
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
