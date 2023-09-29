import { useState } from "react";
import { Auth } from "aws-amplify";
import { apiCall } from "../networking/API";

import { errorLog } from "../utils/errorLog.util";
import { phoneUsername } from "../utils/testFormat.util";
import { verifyConnection } from "../utils/wifiConnection.util";

export const useSignup = (navigation) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorCode, setErrorCode] = useState(null);
  const [user, setUser] = useState(false);
  const [dest, setDest] = useState(false);

  const clearError = () => setError(null);
  const clearErrorCode = () => setErrorCode(null);

  const signUp = async ({
    username,
    password,
    password_confirmation,
    email,
    phone_number,
    terms,
    type = "driver",
  }) => {
    if (!verifyConnection(true)) return;
    if (!password || !password_confirmation || !phone_number)
      return setError("Debes llenar correctamente todos los campos");
    if (password != password_confirmation)
      return setError("La confirmación de contraseña no coincide");
    if (!terms) return setError("Debes aceptar los términos y condiciones");
    if (!type) return setError("Debes especificar un tipo de usuario");

    // setLoading(true);
    setError(false);

    try {
      const res = await SignUp({
        password: password,
        email,
        phone_number: phoneUsername(phone_number, true),
        type,
      });

      navigation.navigate("ConfirmSignup", {
        username: phoneUsername(phone_number, true).split(" ").join(""),
        password,
        email,
      });
      setLoading(false);
    } catch (error) {
      console.error(error?.response?.data);
      setLoading(false);
      const { errorCode } = error?.response?.data || {};
      // return console.log(error.response.data);
      errorLog(errorCode, "SIGN UP HOOK ERROR");

      if (!errorCode || errorCode == "UnexpectedError")
        setError(`Ocurrio un error inesperado, inténte más tarde`);
      else if (errorCode == "ExistentPhoneNumber")
        setErrorCode("UsernameExistsException");
      // else if (error.message.indexOf("number") != -1)
      //   setError(
      //     `Debe ingresar un numero de teléfono valido, recuerda que debes agregar el '+' con el indicativo del país`
      //   );
      // else if (error.message.indexOf("password") != -1)
      //   setError(
      //     `La contraseña es muy corta debe contener al menos 6 caracteres`
      //   );
      else if (errorCode == "ConstraintError")
        setError(
          `El usuario ya se encuentra registrado, intenta recuperando contraseña`
        );
    }
  };

  return {
    loading,
    error,
    clearError,
    errorCode,
    clearErrorCode,
    user,
    signUp,
    dest,
  };
};

const SignUp = ({ password, email, phone_number, type }) =>
  new Promise(async (resolve, reject) => {
    try {
      const data = { password, email, phone_number, type };
      const formData = new FormData();
      Object.keys(data).map((k) => formData.append(k, data[k]));

      const res = await apiCall("/auth/signup", formData, null, "POST");
      console.log("AMPLIFY SIGN UP SUCCESS", res);
      return resolve(res);
    } catch (error) {
      console.error("AMPLIFY SIGN UP SUCCESS", error);
      errorLog(error, "SIGN UP AMPLIFY ERROR");
      return reject(error);
    }
  });
