import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { getNearDrivers } from "../../../../networking/API";
import { verifyConnection } from "../../../../utils/wifiConnection.util";
export default () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const {
    driver: { token, user },
  } = useSelector(({ driverReducer }) => driverReducer);
  const {
    coords: { latitude, longitude },
  } = useSelector(({ userLocationReducer }) => userLocationReducer);

  const loadDriversNear = () =>
    new Promise(async (resolve, reject) => {
      try {
        if (!user?.Zone?.code) return resolve([]);
        if (!verifyConnection()) return reject();
        setError(null);
        setLoading(true);
        const data = await getNearDrivers(
          token,
          user?.Zone?.code,
          latitude,
          longitude
        );
        setLoading(false);

        resolve(data);
      } catch (error) {
        setError(error);
        setLoading(false);
        reject(error);
      }
    });

  return { loadDriversNear, loading, error };
};
