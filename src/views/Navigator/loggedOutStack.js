import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//*VISTAS DEL DRIVER
import RegisterDriverView from "../auth/taxista/RegisterDriverView";

//*VISTAS DEL CLIENT
import RegisterUserView from "../auth/usuario/RegisterUserView";

//* VISTAS COMPARTIDAS
import LoginView from "../auth/LoginView";
import ConfirmMessageView from "../auth/ConfirmMessageView";
import RegisterOptionsView from "../auth/RegisterOptionsView";
import SignupView from "../auth/SignupView";
import ConfirmSignupView from "../auth/ConfirmSignupView";
import PasswordRecoveryView from "../auth/PasswordRecoveryView";
import RecoveryPasswordSubmitView from "../auth/RecoveryPasswordSubmitView";
import VerifyPhoneSubmitView from "../auth/VerifyPhoneSubmitView";
import Terms from "../main/Terms";

//*VISTAS DEL PORTER
import RegisterWatchManView from "../auth/portero/RegisterWatchManView";

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        options={{ headerShown: false }}
        name="Login"
        component={LoginView}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ErrorMessage"
        component={ConfirmMessageView}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Signup"
        component={SignupView}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="RegisterOptions"
        component={RegisterOptionsView}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="VerifyPhone"
        component={VerifyPhoneSubmitView}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ConfirmSignup"
        component={ConfirmSignupView}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="PasswordRecovery"
        component={PasswordRecoveryView}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="RecoveryPasswordSubmit"
        component={RecoveryPasswordSubmitView}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="RegisterDriver"
        component={RegisterDriverView}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="RegisterUser"
        component={RegisterUserView}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="RegisterWatchMan"
        component={RegisterWatchManView}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Terms"
        component={Terms}
      />
    </Stack.Navigator>
  );
};
