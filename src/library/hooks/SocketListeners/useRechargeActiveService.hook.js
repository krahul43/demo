import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveServiceAction } from "../../redux/actions/activeService.action";
import { apiCall } from "../../networking/API";
export default () => {
  const [
    loadingActiveServiceRecharge,
    setLoadingActiveServiceRecharge,
  ] = useState();
  const {
    driver: { token },
  } = useSelector(({ driverReducer }) => driverReducer);
  const data = useSelector(({ activeServiceReducer }) => activeServiceReducer);
  const dispatch = useDispatch();
  const setActiveServiceInStore = (t) => dispatch(setActiveServiceAction(t));
  const rechargeActiveService = () =>
    new Promise(async (resolve, reject) => {
      try {
        if (!data) return resolve();
        const { id } = data || {};
        setLoadingActiveServiceRecharge(false);
        const { data: res } = await apiCall(
          `/api/travelReservation/${id}`,
          {},
          {
            "taxi-zone-access-token": token,
          }
        );
        console.log(res);
        resolve();
      } catch (error) {
        setLoadingActiveServiceRecharge(false);
      }
    });
  return { rechargeActiveService, loadingActiveServiceRecharge };
};
