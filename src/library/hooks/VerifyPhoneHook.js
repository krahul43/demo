import { useState } from "react";
import { Auth } from "aws-amplify";
import { errorLog } from "../utils/errorLog.util";

export const useVerifyPhoneSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [ok, setOk] = useState(false);

  const verifyPhoneSubmit = async ({code}) => {
    if (!code) return setError("Ingresa el código de verificación");
  
    setError(false);
    setLoading(true);
    try {
      const res = await PhoneVerifyConfirm(code) //! FUNCION AMPLIFY QUE VERIFICA SI EL CODIGO CONFIRMADO DEL NUEVO CELULAR ES CORRECTO

      if(res === "SUCCESS") {
        setOk(true);
        setLoading(false);
      }
    } catch (error) {
      //* POSIBLES ERRORES (LOG DE COLOR ROJO)
      errorLog(error, 'VERIFY NEW PHONE HOOK ERROR');
      if (error.code === "CodeMismatchException")
        setError("El código de verificación no es valido");
      else if(error.code === "ExpiredCodeException")
        setError("El código de verificación ha expirado solicite uno nuevo");
      else if (error.code === "LimitExceededException")
        setError("Demasiados intentos, inténte más tarde");
      else 
        setError(`Ocurrio un error inesperado, inténte más tarde`);
      setLoading(false);
    } 
  };

  return { loading, error, ok, verifyPhoneSubmit };
};

const PhoneVerifyConfirm = async (code) => {
  try {
    const res = await Auth.verifyCurrentUserAttributeSubmit('phone_number',code);
    console.log('PHONE VERIFIED RESPONSE: ',res)
    return Promise.resolve(res);
  } catch (error) {
    errorLog(error, 'VERIFY NEW PHONE AMPLIFY ERROR');
    return Promise.reject(error);
  }
};
