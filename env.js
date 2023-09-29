import Constants from "expo-constants";
export const { ENV } = Constants.manifest.extra;
export const dev = ENV === "dev";
export const mapKey = "AIzaSyA81BAO5svAUuRpEudnHT6vipVjNdmSQAM";
export const BASE_URL = "https://api.taxizone.com.co:8443";
// "https://api.taxizone.com.co:8443";
export const timezone = "America/Bogota";
export const counterLimit = 20;
