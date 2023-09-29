import { useEffect } from "react";
import { subscribeClientToTakenActiveTravelReservationEvent } from "../../../socketIO/client/travelReservation";
export default (travelReservation, callback) => {
  useEffect(() => {
    if (travelReservation) {
      const removeSubscription = subscribeClientToTakenActiveTravelReservationEvent(
        callback
      );
      return () => removeSubscription();
    }
  }, [travelReservation]);
};
