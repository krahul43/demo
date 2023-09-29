import { useState } from "react";
import { Auth } from "aws-amplify";
import { useDispatch } from "react-redux";
import { apiCall } from "../networking/API";

import { signOut } from "../hooks/User.hooks";
import { setDriverApiAction } from "../redux/actions/taxista/driverAction";
import { deleteDriverApiAction } from "../redux/actions/taxista/driverAction";
import { setUserAWS } from "../redux/actions/Auth.action";

import { getUser } from "../networking/API";
import { errorLog } from "../utils/errorLog.util";
import { phoneUsername } from "../utils/testFormat.util";
import { verifyConnection } from "../utils/wifiConnection.util";

export const useSignin = (isRegister = false, navigation) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorCode, setErrorCode] = useState(null);
  const [user, setUser] = useState(null);

  const clearError = () => setError(null);
  const clearErrorCode = () => setErrorCode(null);

  const signIn = async ({ username, password }) => {
    if (!verifyConnection(true)) return;
    if (!username || !password)
      return setError("Debes llenar correctamente todos los campos");

    setError(false);
    setLoading(true);

    try {
      const us = await SignIn({ username: username, password });
      setLoading(false);
      const { token } = us;
      const api_user = await getUser(token);
      setUser(api_user);
      if (api_user.user.type == "client" || api_user.user.type == "porter") {
        if (api_user.user.complete_info == 0) {
          //! CLIENTE SIN DATOS COMPLETADOS
          console.log("CLIENTE SIN DATOS COMPLETADOS");
          dispatch(setDriverApiAction({ ...api_user, token }));
          throw "ClientNotFillData";
        } else {
          //! CLIENTE REGISTRATO, CONTINUA A LA APLICACION
          if (isRegister) throw "ClientNotFillData";
          return setTimeout(() => {
            dispatch(setUserAWS(us));
            dispatch(setDriverApiAction({ ...api_user, token }));
          }, 100);
        }
      } else if (api_user.user.type == "driver") {
        console.log("driver");
        if (api_user.user.complete_info == 0) {
          //! CONDUCTOR  SIN DATOS COMPLETADOS
          // await signOut();
          console.log("incomplete info");
          dispatch(setDriverApiAction({ ...api_user, token }));
          throw "DriverNotFillData";
        } else {
          if (api_user.user.need_review == 1) {
            //! CONDUCTOR CON DATOS COMPLETADOS PERO EN REVISION
            // await signOut();
            dispatch(deleteDriverApiAction());
            throw "NotReviewData";
          } else {
            if (api_user.user.confirmed_documents == 0) {
              //! CONDUCTOR CON DATOS COMPLETADOS Y CON CORRECCIONES
              // await signOut();
              dispatch(setDriverApiAction({ ...api_user, token }));
              throw "NotValidDocuments";
            } else {
              //! CONDUCTOR REGISTRADO, CONTINUA A LA APP
              if (isRegister) throw "DriverNotFillData";
              setTimeout(() => {
                dispatch(setUserAWS(us));
                dispatch(setDriverApiAction({ ...api_user, token }));
              }, 100);
            }
          }
        }
      }
      setLoading(false);
    } catch (error) {
      let errorCode;
      if (typeof error == "object") errorCode = error?.response?.data.errorCode;
      if (typeof error == "string") errorCode = error;
      setLoading(false);
      errorLog(errorCode, "LOGIN HOOK ERROR");
      console.error(errorCode);
      if (errorCode) {
        if (
          errorCode === "UnexistentUser" ||
          errorCode === "IncorrectPassword"
        ) {
          setError(`Teléfono o contraseña incorrecta`);
        } else if (errorCode === "UnconfirmedUser") {
          setErrorCode("UserNotConfirmedException");
          navigation.navigate("ConfirmSignup", {
            reSend: true,
            username: username,
            password,
            email: error?.response?.data?.email,
          });
          // console.log(error?.response?.data?.email);
        } else if (errorCode === "PasswordNeeded") {
          navigation.navigate("RecoveryPasswordSubmit", {
            reSend: true,
            username: username,
            email: error?.response?.data?.email,
          });
        } else if (errorCode === "UnexpectedError") {
          setError("Ocurrio un error inesperado, por favor intènte más tarde");
        } else if (error === "NotReviewData") {
          setErrorCode("NotReviewData");
        } else if (error === "DriverNotFillData") {
          setErrorCode("DriverNotFillData");
        } else if (error === "ClientNotFillData") {
          setErrorCode("ClientNotFillData");
        } else if (error === "NotValidDocuments") {
          setErrorCode("NotValidDocuments");
        } else {
          setError("Ocurrio un error inesperado, por favor intènte más tarde");
        }
      }
    }
  };

  return {
    loading,
    error,
    signIn,
    errorCode,
    clearErrorCode,
    clearError,
    user,
  };
};

export const SignIn = async ({ username, password }) => {
  try {
    const { data: res } = await apiCall(
      "/auth/login",
      { phone_number: phoneUsername(username, true), password },
      null,
      "POST"
    );
    // const user = await Auth.signIn(username, password);
    console.log("Login IN SUCCESS", res);
    return Promise.resolve(res);
  } catch (error) {
    errorLog(error, "LOGIN ERROR");
    return Promise.reject(error);
  }
};
