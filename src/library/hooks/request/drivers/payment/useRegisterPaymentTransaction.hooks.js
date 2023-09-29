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

  const registerTransaction = (payment) =>
    new Promise(async (resolve, reject) => {
      try {
        if (!verifyConnection()) reject();
        setError(null);
        setLoading(true);
        payment = JSON.stringify(payment.data.data);
        const formData = new FormData();
        formData.append("data", payment);
        const { data: res } = await apiCall(
          `/api/payments2`,
          formData,
          {
            "taxi-zone-access-token": token,
          },
          "POST"
        );
        setLoading(false);

        resolve(res);
      } catch (error) {
        setError(error);
        setLoading(false);
        reject(error);
      }
    });

  return { registerTransaction, loading, error };
};
