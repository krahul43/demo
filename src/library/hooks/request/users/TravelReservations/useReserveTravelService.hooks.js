import { useSelector } from "react-redux";
import { useState } from "react";
import { apiCall } from "../../../../networking/API";
import { verifyConnection } from "../../../../utils/wifiConnection.util";
export default () => {
  const {
    driver: { token },
  } = useSelector(({ driverReducer }) => driverReducer);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservationResponse, setReservationResponse] = useState(false);

  const reserveTravelService = (data) =>
    new Promise(async (resolve, reject) => {
      try {
        if (!verifyConnection()) reject();
        setLoading(true);
        setError(null);
        const formData = new FormData();
        Object.keys(data).map((key) => formData.append(key, data[key]));
        const res = await apiCall(
          `/api/travel-reservation`,
          formData,
          {
            "taxi-zone-access-token": token,
          },
          "POST"
        );
        console.log(res);
        setLoading(false);
        setReservationResponse(res);
        resolve(res);
      } catch (error) {
        setLoading(false);
        setError("La reservación de servicio fallo, intantalo de nuevo");
        reject(error);
      }
    });

  return { reserveTravelService, loading, error, reservationResponse };
};
