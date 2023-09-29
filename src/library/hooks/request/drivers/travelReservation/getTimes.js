import { apiCall } from "../../../../networking/API";
import { verifyConnection } from "../../../../utils/wifiConnection.util";
export default () =>
  new Promise(async (resolve, reject) => {
    try {
      if (!verifyConnection()) reject();
      const { data } = await apiCall(`/api/configs/estimated-times`);

      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
