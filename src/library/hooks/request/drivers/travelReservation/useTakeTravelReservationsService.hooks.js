import { useSelector } from "react-redux";
import { useState } from "react";
import { apiCall } from "../../../../networking/API";
import { verifyConnection } from "../../../../utils/wifiConnection.util";
export default () => {
  const {
    driver: { token },
  } = useSelector(({ driverReducer }) => driverReducer);

  const takeTravelReservations = (travel_id) =>
    new Promise(async (resolve, reject) => {
      try {
        if (!verifyConnection()) reject();
        const res = await apiCall(
          `/api/travel-reservation/take/${travel_id}`,
          null,
          {
            "taxi-zone-access-token": token,
          },
          "POST"
        );
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });

  return takeTravelReservations;
};
