import { useSelector } from "react-redux";
import { useState } from "react";
import { updateTravelReservation } from "../../../../networking/API";
import { verifyConnection } from "../../../../utils/wifiConnection.util";
export default () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const {
    driver: { token },
  } = useSelector(({ driverReducer }) => driverReducer);

  const evaluateSevice = (travel_id, data) =>
    new Promise(async (resolve, reject) => {
      try {
        // const {
        //   driver_stars_rating,
        //   client_stars_rating,
        //   driver_comments,
        //   client_comments
        // } = data

        if (!verifyConnection()) reject();
        setError(null);
        setLoading(true);
        const formData = new FormData();
        Object.keys(data).map((k) => formData.append(k, data[k]));
        const res = await updateTravelReservation(token, travel_id, formData);
        setLoading(false);

        resolve(res);
      } catch (error) {
        setError(error);
        setLoading(false);
        reject(error);
      }
    });

  return { evaluateSevice, loading, error };
};
