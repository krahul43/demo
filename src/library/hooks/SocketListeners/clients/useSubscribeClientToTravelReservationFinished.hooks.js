import { useEffect } from "react";
import { subscribeClientToTavelReservationFinished } from "../../../socketIO/client/travelReservation";
export default (travelReservation, callback) => {
  useEffect(() => {
    if (travelReservation) {
      const removeSubscription = subscribeClientToTavelReservationFinished(
        callback
      );
      return () => removeSubscription();
    }
  }, [travelReservation]);
};
