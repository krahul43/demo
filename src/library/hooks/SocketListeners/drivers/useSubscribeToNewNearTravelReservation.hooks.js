import { useEffect } from "react";
import { subscribeDriverToNewNearTravelReservationEvent } from "../../../socketIO/driver/travelReservation";
/**
 * @description Manages de subscription to new travel reservation event
 * @param {Function} callback Function to execute when a new near travel reservation is received, receives the new travel reservation as argument
 */

export default (user, focus, callback) => {
  useEffect(() => {
    if (user && focus) {
      console.log("subscribeDriverToNewNearTravelReservationEvent");
      const subscription = subscribeDriverToNewNearTravelReservationEvent(
        callback
      );
      return () => subscription();
    }
  }, [user, focus]);
};
