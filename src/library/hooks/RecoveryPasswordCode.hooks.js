import { useState } from "react";
import { apiCall } from "../networking/API";
import { Auth } from "aws-amplify";
import { phoneUsername } from "../utils/testFormat.util";
import { errorLog } from "../utils/errorLog.util";
import { verifyConnection } from "../utils/wifiConnection.util";

export const useForgotPasswordSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [ok, setOk] = useState(false);

  const forgotPasswordSubmit = async ({
    username,
    password,
    passwordConfirmation,
    code,
  }) => {
    if (!verifyConnection(true)) return;
    if (!code || !password || !passwordConfirmation)
      return setError("Debes ingresar todos los campos.");
    if (password != passwordConfirmation)
      return setError("La confirmación de contraseña no coincide.");

    setError(false);
    setLoading(true);
    try {
      const res = await ForgotPasswordSubmit({
        username: username,
        code,
        new_password: password,
      });
      setLoading(false);
      setOk(true);
    } catch (error) {
      setLoading(false);
      //* POSIBLES ERRORES (LOG DE COLOR ROJO)
      errorLog(error, "RECOVERY PASSWORD CODE HOOK ERROR");
      if (error?.response?.data?.ok === false)
        setError("El código de verificación no coincide");
      else if (error?.response?.data?.errorCode === "UnexistentUser")
        setError("Hubo un error con el usuario a verificar");
      else if (error?.response?.data?.errorCode === "UnexpectedError")
        setError("Ocurrió un error inesperado, por favor inténte más tarde");
      else if (error)
        setError("Ocurrió un error inesperado, por favor inténte más tarde");
    }
  };

  return {
    loading,
    error,
    forgotPasswordSubmit,
    ok,
  };
};

const ForgotPasswordSubmit = async ({ username, code, new_password }) => {
  try {
    const {
      data: { token, ok },
    } = await apiCall(
      "/auth/verify-code",
      { phone_number: phoneUsername(username, true), verification_code: code },
      null,
      "POST"
    );
    if (ok) {
      const {
        data: { ok: password_ok },
      } = await apiCall(
        "/auth/password",
        {
          password: new_password,
        },
        { "taxi-zone-access-token": token },
        "PUT"
      );
      return Promise.resolve(token);
    }
    return Promise.reject({ ok: false });
  } catch (error) {
    console.error(error?.response?.data);
    errorLog(error, "RECOVERY PASSWORD CODE AMPLIFY ERROR");
    return Promise.reject(error);
  }
};
