import { useEffect } from "react";
import { subscribeClientToTravelReservationDriverAtPlaceEvent } from "../../../socketIO/client/travelReservation";
export default (travelReservation, callback) => {
  useEffect(() => {
    if (travelReservation) {
      const removeSubscription = subscribeClientToTravelReservationDriverAtPlaceEvent(
        callback
      );
      return () => removeSubscription();
    }
  }, [travelReservation]);
};
