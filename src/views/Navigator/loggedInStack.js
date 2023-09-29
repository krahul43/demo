import * as React from "react";
import { useSelector } from "react-redux";

import { createStackNavigator } from "@react-navigation/stack";
import { DriverCommunication } from "../../library/hooks/users/driversComunicationRegistry.hooks";
import { ClientCommunication } from "../../library/hooks/users/clientsComunicationRegistry.hooks";

//*VISTAS DEL DRIVER
import TripsMadeView from "../main/driver/TravelReservations/Taken";
import RegisterDriverView from "../auth/taxista/RegisterDriverView";
import ServicesListView from "../main/driver/TravelReservations/Near";
import ServiceDetailView from "../main/driver/TravelReservations/ServiceDetail/";
import WalletView from "../main/driver/Payments/WalletView";
import PaymentPseView from "../main/driver/Payments/PaymentPseView";
import PaymentCreditCardView from "../main/driver/Payments/PaymentCreditCardView";
import RechargesHistoryView from "../main/driver/RechargesHistoryView";
import PlacesPicker from "../../library/components/PlacesPicker";

//* VISTAS DEL CLIENT
import RegisterUserView from "../auth/usuario/RegisterUserView";
import UserHomeView from "../main/user/UserHomeView";

//* VISTAS DEL PORTERO
import PorterHomeView from "../main/porter/PorterHomeView";

//* VISTAS COMPARTIDAS
import UserSettingsView from "../main/UserSettingsView";
import UserProfileView from "../main/UserProfileView";
import Terms from "../main/Terms";
import ChangePasswordView from "../auth/ChangePasswordView";
import ChangePhoneView from "../auth/ChangePhoneView";
import VerifyPhoneSubmitView from "../auth/VerifyPhoneSubmitView";

const Stack = createStackNavigator();

export default () => {
  const { driver } = useSelector(({ driverReducer }) => driverReducer);
  const activeService = useSelector(
    ({ activeServiceReducer }) => activeServiceReducer
  );
  const { type: userType = "driver" } = driver?.user || {};
  const isDriver = userType == "driver";
  const isClient = userType == "client";
  const isPorter = userType == "porter";
  const isActiveServiceNew = activeService?.isNew || false;

  return (
    <>
      {isDriver && <DriverCommunication />}
      {(isClient || isPorter) && <ClientCommunication />}
      <Stack.Navigator
        initialRouteName={
          isActiveServiceNew && !isPorter
            ? // if there is an active new service
              "ServiceDetail"
            : isDriver
            ? // if driver
              "Services"
            : isPorter
            ? // if porter
              "PorterHome"
            : // if client
              "UserHome"
          //"Directions" //? pruebas
        }
      >
        <Stack.Screen
          options={{ headerShown: false }}
          name="Services"
          component={ServicesListView}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="PlacesPicker"
          component={PlacesPicker}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ServiceDetail"
          component={ServiceDetailView}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="UserHome"
          component={UserHomeView}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="PorterHome"
          component={PorterHomeView}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="RegisterUser"
          component={RegisterUserView}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Settings"
          component={UserSettingsView}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Profile"
          component={UserProfileView}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="RegisterDriver"
          component={RegisterDriverView}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ChangePassword"
          component={ChangePasswordView}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ChangePhone"
          component={ChangePhoneView}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="VerifyPhone"
          component={VerifyPhoneSubmitView}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Wallet"
          component={WalletView}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Trips"
          component={TripsMadeView}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="PayPse"
          component={PaymentPseView}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="PayCard"
          component={PaymentCreditCardView}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Refills"
          component={RechargesHistoryView}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Terms"
          component={Terms}
        />
      </Stack.Navigator>
    </>
  );
};
