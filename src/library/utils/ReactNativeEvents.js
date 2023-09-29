import { NativeModules } from "react-native";
import RNEvents from "react-native-events";

var MyNativeModule = (() => NativeModules)();

// register your event emitter to be able to send events
// RNEvents.register(MyNativeModule);
// // conform your native module to EventEmitter
// RNEvents.conform(MyNativeModule);

export default MyNativeModule;
