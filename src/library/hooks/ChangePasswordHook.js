import { useState } from "react";
import { Auth } from "aws-amplify";
import { errorLog } from "../utils/errorLog.util";

export const useChangePasswordSubmit= () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [ok, setOk] = useState(false);

  const changePasswordSubmit = async({
    old_password,
    new_password,
    confirm_new_password
  }) => {
    if (!old_password || !new_password || !confirm_new_password)
      return setError("Debes llenar todos los campos");
    if (new_password != confirm_new_password)
      return setError("La confirmación de contraseña no coincide");

    setError(false);
    setLoading(true);
    try {
      const res = await ChangePasswordSubmit({ //! FUNCION AMPLIFY PARA EL CAMBIO DE CONTRASEÑA DEL USUARIO LOEGADO
        old_password,
        new_password
      });
      
      setOk(true)
      setLoading(false);
    } catch (error) {
      //* POSIBLES ERRORES (LOG DE COLOR ROJO)
      errorLog(error, 'CHANGE PASSWORD HOOK ERROR');
      if (error.code == "NotAuthorizedException")
        setError('La contraseña ingresada es incorrecta');
      else if(error.code == "InvalidParameterException")
        setError('La contraseña es muy corta debe contener al menos 6 caracteres');
      else if (error.code == "InvalidPasswordException")
        setError('La contraseña es muy débil debe contener mayùsculas y minúsculas');
      else if (error.code === "LimitExceededException")
        setError("Demasiados intentos, inténtalo más tarde");
      else
        setError("Ocurrió un error inesperado, por favor intènte más tarde");
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    ok,
    changePasswordSubmit,
  };
};

const ChangePasswordSubmit = async ({ old_password, new_password }) => {
  try {
    const currentUser = await Auth.currentAuthenticatedUser();
    const res = await Auth.changePassword(currentUser, old_password, new_password);
    //console.log('AMPLIFY CHANGE PASSWORD SUCCESS',res);
    return Promise.resolve(res);
  } catch (error) {
    errorLog(error, 'CHANGE PASSWORD AMPLIFY ERROR');
    return Promise.reject(error);
  }
};
