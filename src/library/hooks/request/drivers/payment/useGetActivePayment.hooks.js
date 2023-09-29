import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { apiCall } from "../../../../networking/API";
import { verifyConnection } from "../../../../utils/wifiConnection.util";
export default () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const {
    driver: { token },
  } = useSelector(({ driverReducer }) => driverReducer);

  const getPayment = (paymentID) =>
    new Promise(async (resolve, reject) => {
      try {
        if (!verifyConnection()) reject();
        setError(null);
        setLoading(true);
        const { data } = await apiCall(
          `/api/payments2/${paymentID}`,
          null,
          {
            "taxi-zone-access-token": token,
          },
          "GET"
        );
        setLoading(false);

        resolve(data);
      } catch (error) {
        setError(error);
        setLoading(false);
        reject(error);
      }
    });

  return { getPayment, loading, error };
};
