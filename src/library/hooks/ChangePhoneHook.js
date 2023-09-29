import { useState } from "react";
import { Auth } from "aws-amplify";
import { useSelector } from "react-redux";
import { verifyConnection } from "../utils/wifiConnection.util";
import { apiCall } from "../../library/networking/API";
import { errorLog } from "../utils/errorLog.util";
import { SignIn } from "../hooks/Login.hooks";

export const useChangePhone = () => {
  const { driver } = useSelector(({ driverReducer }) => driverReducer);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [ok, setOk] = useState(false);

  const changePhoneSubmit = async ({ username, password, new_phoneNumber }) => {
    if (!verifyConnection(true)) return;
    if (!username || !password || !new_phoneNumber)
      return setError("Debes llenar correctamente todos los campos");

    if (username.length < 10) return setError("Numero de teléfono invalido");

    setError(false);
    setLoading(true);
    try {
      const { ok: signinOk } = await SignIn({ username, password });
      if (!signinOk) {
        setLoading(false);
        return setError("Ocurrio un error al validar las credenciales");
      }
      try {
        let data = new FormData();
        data.append("phone_number", new_phoneNumber);
        data.append("confirmed", 0);
        const response = await apiCall(
          "/auth/user",
          data,
          {
            "taxi-zone-access-token": driver?.token,
            "Content-Type": "multipart/form-data",
          },
          "PUT"
        );
        console.log("NUMBER UPDATE SUCCESS");
        setOk(true);
        setLoading(false);
        console.log({ response });
        //dispatch(setUserAWS(null))
      } catch (error) {
        setLoading(false);
        throw error;
      }
      // console.log({ response });
    } catch (error) {
      //* POSIBLES ERRORES
      console.error(error.response.data);
      errorLog(error, "CHANGE PHONE HOOK ERROR");
      if (error?.response?.data?.errorCode === "IncorrectPassword")
        setError(`Contraseña incorrecta`);
      else setError("Ocurrio un error inesperado, por favor inténte más tarde");

      setLoading(false);
    }
  };

  return {
    loading,
    error,
    ok,
    changePhoneSubmit,
  };
};
