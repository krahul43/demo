import { useEffect } from "react";
import { subscribeClientToTavelReservationCanceled } from "../../../socketIO/client/travelReservation";
export default (travelReservation, callback) => {
  useEffect(() => {
    if (travelReservation) {
      const removeSubscription = subscribeClientToTavelReservationCanceled(
        callback
      );
      return () => removeSubscription();
    }
  }, [travelReservation]);
};
