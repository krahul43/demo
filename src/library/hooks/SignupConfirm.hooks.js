import { useState } from "react";
import { Auth } from "aws-amplify";
import { apiCall } from "../networking/API";
import { verifyConnection } from "../utils/wifiConnection.util";

import { errorLog } from "../utils/errorLog.util";
import { phoneUsername } from "../utils/testFormat.util";
export const useSignupConfirm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [ok, setOk] = useState(false);

  const clearError = () => setError(null);

  const signUpConfirm = async ({ username, code }) => {
    if (!verifyConnection(true)) return;
    if (!code) return setError("Ingresa el código de verificación");
    //if (!username) return setError("Ocurrio un error inesperado");

    setLoading(true);
    setError(false);
    try {
      const { ok } = await SignUpConfirm({
        username: phoneUsername(username, true),
        verification_code: code,
      }); //! RESPUESTA DE AMPLIFY SI EL CODIGO ES CORRECTO NO ARROJA ERROR

      if (ok) {
        setLoading(false);
        return setOk(true);
      }
    } catch (error) {
      if (error?.response?.data?.ok === false) {
        setLoading(false);
        setError("El código de verificación no es valido");
      } else {
        console.error(error.response.data);
        setLoading(false);
        //* POSIBLES ERRORES (LOG DE COLOR ROJO)
        errorLog(error, "SIGN UP CODE HOOK ERROR");
        setError(`Ocurrio un error inesperado, inténte más tarde`);
      }
    }
  };

  return { loading, error, clearError, ok, signUpConfirm };
};

//* FUNCION DE AWS PARA VALIDAR EL CODIGO DE CONFIRMACION
const SignUpConfirm = ({ username, verification_code }) =>
  new Promise(async (resolve, reject) => {
    try {
      const { data: res } = await apiCall(
        "/auth/verify-code",
        { phone_number: phoneUsername(username, true), verification_code },
        null,
        "POST"
      );
      // const user = await Auth.signIn(username, password);
      console.log("SignUpConfirm IN SUCCESS", res);

      return resolve(res);
    } catch (error) {
      errorLog(error, "SignUpConfirm ERROR");
      return reject(error);
    }
  });

export const resendSignUpConfirm = (username, sendOption = "sms") =>
  new Promise(async (resolve, reject) => {
    try {
      const { data: res } = await apiCall(
        "/auth/send-code",
        { phone_number: phoneUsername(username, true), sendOption },
        null,
        "POST"
      );
      // const user = await Auth.signIn(username, password);
      console.log("resendSignUpConfirm IN SUCCESS", res);

      return resolve(res);
    } catch (error) {
      console.error(error);
      errorLog(error, "SIGN UP RESEND CODE AMPLIFY ERROR");
      return reject(error);
    }
  });
