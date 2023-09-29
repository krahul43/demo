import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { apiCall } from "../../../../networking/API";
import { verifyConnection } from "../../../../utils/wifiConnection.util";
import { setDriverApiAction } from "../../../../redux/actions/taxista/driverAction";
export default () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const setDriver = (driver) => dispatch(setDriverApiAction(driver));
  const { driver } = useSelector(({ driverReducer }) => driverReducer);

  const { token } = driver;
  const getUserWalletBalance = () =>
    new Promise(async (resolve, reject) => {
      console.log("getUserWalletBalance");
      try {
        if (!verifyConnection()) reject();
        setError(null);
        setLoading(true);
        const { data: wallet_balance } = await apiCall(
          `/auth/user/wallet-balance`,
          null,
          {
            "taxi-zone-access-token": token,
          },
          "GET"
        );
        setDriver({ ...driver, user: { ...driver.user, wallet_balance } });
        setLoading(false);
        resolve(wallet_balance);
      } catch (error) {
        setError(error);
        setLoading(false);
        reject(error);
      }
    });

  return { getUserWalletBalance, loading, error };
};
