import { useState } from "react";
import { Auth } from "aws-amplify";
import { resendSignUpConfirm } from "./SignupConfirm.hooks";
import { errorLog } from "../utils/errorLog.util";
import { verifyConnection } from "../utils/wifiConnection.util";

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [dest, setDest] = useState("");
  const [email, setEmail] = useState("");

  const forgotPassword = async (username) => {
    if (!verifyConnection(true)) return;
    if (!username) return setError("Ingresa tu numero de telefono");
    else if (!/^\d+$/.test(username.substr(1)))
      return setError("Ingresa un numero de telefono valido");

    setError(false);
    setLoading(true);
    try {
      console.log(username);
      const res = await resendSignUpConfirm(username.replace(" ", ""));
      setLoading(false);
      const { ok, email } = res; // si la respuesta es exitosa, debe retornar el email correspondiente al numero de telefono
      if (ok) {
        setEmail(email);
        setDest(username);
      }
    } catch (error) {
      setLoading(false);
      errorLog(error, "RECOVERY PASSWORD HOOK ERROR");

      if (error?.response?.data?.errorCode == "UnexistentUser") {
        setError(
          "El numero ingresado no es se encuentra registrado, puedes crear una cuenta nueva."
        );
      } else if (error)
        setError("Ocurrió un error inesperado, por favor inténte más tarde");
    }
  };

  return {
    loading,
    error,
    dest,
    email,
    forgotPassword,
  };
};
