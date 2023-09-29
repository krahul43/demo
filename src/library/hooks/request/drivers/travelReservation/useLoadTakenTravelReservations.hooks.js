import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { apiCall } from "../../../../networking/API";
import {
  setTakenTravelReservationsAction,
  addTakenTravelReservationsAction,
  setTakenTravelReservationsLoadingAction,
} from "../../../../redux/actions/taxista/travelReservations/takenTravelReservationsAction";
import { verifyConnection } from "../../../../utils/wifiConnection.util";
export default () => {
  const {
    driver: { token, user },
  } = useSelector(({ driverReducer }) => driverReducer);

  const dispatch = useDispatch();

  const setTakenTravelReservations = (travelReservations) =>
    dispatch(setTakenTravelReservationsAction(travelReservations));

  const addTakenTravelReservations = (travelReservations) =>
    dispatch(addTakenTravelReservationsAction(travelReservations));

  const setTakenTravelReservationsLoading = (loading) =>
    dispatch(setTakenTravelReservationsLoadingAction(loading));

  const getTakenTravelReservations = async (page) => {
    try {
      if (!verifyConnection()) return reject();
      setTakenTravelReservationsLoading(true);
      const {
        data: { rows: travels },
      } = await apiCall(
        `/api/travel-reservation/taken/${user.id}?page=${page}`,
        null,
        {
          "taxi-zone-access-token": token,
        }
      );
      // console.log(travels)
      addTakenTravelReservations(travels);
      setTakenTravelReservationsLoading(false);
    } catch (error) {
      setTakenTravelReservationsLoading(false);
      console.error(error);
    }
  };

  return { getTakenTravelReservations, setTakenTravelReservations };
};
