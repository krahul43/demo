import { useEffect } from "react";
import { subscribeDriverToRemoveNearTravelReservationEvent } from "../../../socketIO/driver/travelReservation";
/**
 * @description Manages de subscription to new travel reservation event
 * @param {Function} callback Function to execute when a new near travel reservation is received, receives the new travel reservation as argument
 */

export default (user, callback) => {
  useEffect(() => {
    if(user){
      const subscription = subscribeDriverToRemoveNearTravelReservationEvent(
        callback
      );
      return () => subscription();
    }
  }, [user]);
};
