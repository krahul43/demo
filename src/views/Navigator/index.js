import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Auth } from "aws-amplify";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContent } from "./DrawerContent";
import { StyleSheet } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";

import LoggedInStack from "./loggedInStack";
import LoggedOutStack from "./loggedOutStack";
import AlertModal from "../../library/components/AlertModal";
import MaintenanceModal from "../../library/components/MaintenanceModal";

import { getMaintenanceState } from "../../library/networking/API";
import { setInternetState } from "../../library/redux/actions/internetAction";
import { setMaintenanceState } from "../../library/redux/actions/maintenanceAction";
import { deleteDriverApiAction } from "../../library/redux/actions/taxista/driverAction";

const Drawer = createDrawerNavigator();

export default function Navigator() {
  const { aws_user } = useSelector(({ Auth }) => Auth);
  const { driver } = useSelector(({ driverReducer }) => driverReducer);
  const { showInternetAlert } = useSelector(
    ({ internetReducer }) => internetReducer
  );
  const { showMaintenanceAlert } = useSelector(
    ({ maintenanceReducer }) => maintenanceReducer
  );
  const netInfo = useNetInfo();
  const dispatch = useDispatch();

  //console.log("DRIVER TOKEN: ", driver?.token);

  const getMaintenanceStateAsync = async () => {
    const { state } = await getMaintenanceState(driver?.token);
    dispatch(setMaintenanceState(state));
  };

  useEffect(() => {
    getMaintenanceStateAsync();
    if (netInfo.isConnected) {
      dispatch(setInternetState(true));
    } else {
      dispatch(setInternetState(false));
    }
  }, [netInfo]);

  const closeAlert = () => dispatch(setInternetState(true));

  return (
    <NavigationContainer>
      {driver?.user?.complete_info == 1 &&
      ((driver?.user?.confirmed_documents == 1 &&
        driver?.user?.type == "driver") ||
        driver?.user?.type == "porter" ||
        driver?.user?.type == "client") ? (
        <Drawer.Navigator
          drawerContent={(props) => <DrawerContent {...props} />}
          drawerStyle={styles.drawer}
          overlayColor={1}
        >
          <Drawer.Screen name="LogIn" component={LoggedInStack} />
        </Drawer.Navigator>
      ) : (
        <LoggedOutStack />
      )}
      <MaintenanceModal show={showMaintenanceAlert} />
      <AlertModal isVisible={showInternetAlert} closeFunction={closeAlert} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawer: {
    width: 240,
    backgroundColor: "black",
  },
});

// console.log('------------------- AWS_USER -------------------');
// console.log('AWS_USER: ', aws_user);
// Auth.currentAuthenticatedUser().then((data) => console.log('AWS_AUTHENTICATED_USER: ', data)).catch((error) => console.log('AWS_AUTHENTICATED_ERROR: ',error))
// //Auth.currentCredentials().then((data) => console.log('AWS_CREDENTIAL: ', data)).catch((error) => console.log('AWS_CREDENTIAL_ERROR: ',error))
// // Auth.currentSession().then((data) => console.log('AWS_SESSION: ', data)).catch((error) => console.log('AWS_SESSION_ERROR: ',error))
// //Auth.currentUserCredentials().then((data) => console.log('AWS_USER_CREDENTIAL: ', data)).catch((error) => console.log('AWS_USER_CREDENTIAL_ERROR: ',error))
// Auth.currentUserInfo().then((data) => console.log('AWS_CURRENT_USER_INFO: ', data)).catch((error) => console.log('AWS_CURRENT_USER_ERROR: ',error))
//Auth.currentUserPoolUser().then((data) => console.log('AWS_CURRENT_USER_POOL: ', data)).catch((error) => console.log('AWS_CURRENT_USER__POOL_ERROR: ',error))
