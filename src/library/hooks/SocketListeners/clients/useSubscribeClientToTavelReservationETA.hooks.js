import { useEffect } from "react";
import { subscribeClientToTavelReservationETA } from "../../../socketIO/client/travelReservation";
export default (travelReservation, callback) => {
  useEffect(() => {
    if (travelReservation) {
      const removeSubscription = subscribeClientToTavelReservationETA(callback);
      return () => removeSubscription();
    }
  }, [travelReservation]);
};
