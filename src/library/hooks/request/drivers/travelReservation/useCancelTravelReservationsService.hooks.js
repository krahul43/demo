import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { apiCall } from "../../../../networking/API";
import { verifyConnection } from "../../../../utils/wifiConnection.util";
export default () => {
  const [loading, setLoading] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [error, setError] = useState(false);
  const {
    driver: { token },
  } = useSelector(({ driverReducer }) => driverReducer);

  const cancelTravelReservations = (travel_id) =>
    new Promise(async (resolve, reject) => {
      try {
        if (!verifyConnection()) reject();
        setError(null);
        setLoading(true);
        const res = await apiCall(
          `/api/travel-reservation/cancel/${travel_id}`,
          null,
          {
            "taxi-zone-access-token": token,
          },
          "POST"
        );
        setLoading(false);
        setCanceled(true);

        resolve(res);
      } catch (error) {
        setError(error);
        setLoading(false);
        reject(error);
      }
    });

  useEffect(() => {
    setCanceled(false);
  }, []);

  return { cancelTravelReservations, loading, error, canceled, setCanceled };
};
