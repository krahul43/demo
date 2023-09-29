import { useSelector } from "react-redux";
import { apiCall } from "../../../../networking/API";
import {verifyConnection} from '../../../../utils/wifiConnection.util'
export default () => {
  const {
    driver: { token },
  } = useSelector(({ driverReducer }) => driverReducer);

  const setUserAvailability = (availability = true) =>
    new Promise(async (resolve, reject) => {
      try {
        if(!verifyConnection()) reject()
        const res = await apiCall(
          `/auth/user`,
          {
            available: availability,
          },
          {
            'taxi-zone-access-token':token,
          },
          "PUT"
        );
        resolve(res)
      } catch (error) {
        reject(error)
      }
    });

  return setUserAvailability;
};
