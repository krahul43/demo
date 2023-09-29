//*ARCHIVO QUE CERA LA PETICION A LA API
import axios from "axios";

//*URL DE LAS PETICIONES
import { BASE_URL } from "../../../env";

//*UNA FUNCION GENERAL QUE HACE UNA LLAMA A LA API
export const apiCall = (url = "", data = {}, headers = {}, method = "GET") =>
  axios({
    method,
    url: `${BASE_URL}${url}`,
    data,
    headers,
    timeout: 20000,
  });

export const getUser = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/user`, {
      headers: {
        "taxi-zone-access-token": token,
      },
      timeout: 20000,
    });
    //console.log("GET USER SUCCESS: "");

    return response.data;
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", "GET USER FAILED", error);
    throw error;
  }
};

export const updateInfo = async (api_token, data) => {
  try {
    const response = await axios.put(`${BASE_URL}/auth/user`, data, {
      headers: {
        "taxi-zone-access-token": api_token,
        "Content-Type": "multipart/form-data",
      },
      timeout: 20000,
    });
    //console.log("PUT UPDATE INFO SUCCESS");
    return response.data;
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", "PUT UPDATE INFO FAILED", error);
    throw error;
  }
};

export const sendDocument = async (api_token, data) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/user-document`, data, {
      headers: {
        "taxi-zone-access-token": api_token,
        "Content-Type": "multipart/form-data",
      },
      timeout: 20000,
    });
    //console.log("POST DOCUMENT SUCCESS: ");
    return response.data;
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", "´POST DOCUMENT FAILED", error);
    throw error;
  }
};

export const getDocumentTypes = async (api_token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/document-types`, {
      headers: {
        "taxi-zone-access-token": api_token,
      },
      timeout: 20000,
    });
    //console.log("GET DOCUMENTS TYPES SUCCESS: "");
    return response.data;
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", "GET DOCUMENT TYPES FAILED", error);
    throw error;
  }
};

export const getLogedDocuments = async (api_token) => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/user/documents`, {
      headers: {
        "taxi-zone-access-token": api_token,
      },
      timeout: 20000,
    });
    console.log("GET LOGED DOCUMENTS SUCCESS: ", response);
    return response.data;
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", "GET LOGED DOCUMENTS FAILED", error);
    throw error;
  }
};

export const getZones = async (api_token) => {
  console.log(api_token);
  try {
    const response = await axios.get(`${BASE_URL}/api/zones`, {
      headers: {
        "taxi-zone-access-token": api_token,
      },
      timeout: 20000,
    });
    //console.log("GET ZONES SUCCESS: ");
    return response.data;
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", "GET ZONES FAILED", error);
    throw error;
  }
};

export const getDirections = async (api_token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/directions`, {
      headers: {
        "taxi-zone-access-token": api_token,
      },
      timeout: 20000,
    });
    //console.log("GET DIRECCTION SUCCESS");
    return response.data;
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", "GET DIRECTIONS FAILED", error);
    throw error;
  }
};

export const addDirection = async (api_token, data) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/directions`, data, {
      headers: {
        "taxi-zone-access-token": api_token,
      },
      timeout: 20000,
    });
    //console.log("POST NEW DIRECTION SUCCESS");
    return response.data;
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", "POST NEW DIRECCTION FAILED", error);
    throw error;
  }
};

export const removeDirection = async (api_token, direction_id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/directions/${direction_id}`,
      {
        headers: {
          "taxi-zone-access-token": api_token,
        },
        timeout: 20000,
      }
    );
    //console.log("DELETE DIRECCION SUCCESS", response.data);
    return response.data;
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", "DELETE DIRECTION FAILED", error);
    throw error;
  }
};

export const getAddressSuggestions = async (address, userLocation) => {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      {
        params: {
          input: address,
          location: userLocation,
          radius: "500",
          strictbounds: null,
          key: "AIzaSyA81BAO5svAUuRpEudnHT6vipVjNdmSQAM",
          language: "es",
          components: "country:col",
        },
        //timeout: 20000,
      }
    );
    //console.log("GET ADDRES SUGGESTIONS SUCCESS");
    return response.data;
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", "GET ADDRES SUGGESTIONS FAILED", error);
    throw error;
  }
};

export const getAddressCoords = async (address) => {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
      {
        params: {
          input: address,
          inputtype: "textquery",
          key: "AIzaSyA81BAO5svAUuRpEudnHT6vipVjNdmSQAM",
          language: "es",
          fields: "geometry",
        },
        //timeout: 20000,
      }
    );
    //console.log("GET ADDRESS COORDS SUCCESS")
    return response.data;
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", "GET ADDRESS COORDS FAILED", error);
    throw error;
  }
};

export const updateTravelReservation = async (api_token, travel_id, data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/travel-reservation/${travel_id}`,
      data,
      {
        headers: {
          "taxi-zone-access-token": api_token,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    //console.log("UPDATE TRAVEL RESERVATION SUCCESS")
    return response.data;
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", "UPDATE TRAVEL RESERVATION FAILED", error);
    throw error;
  }
};

export const getNearDrivers = async (
  api_token,
  zone_code,
  latitude,
  longitude
) => {
  try {
    const response = await axios.get(
      `https://api.taxizone.com.co:8443/api/drivers/near/${zone_code}/${latitude}/${longitude}`,
      {
        headers: {
          "taxi-zone-access-token": api_token,
        },
        timeout: 20000,
      }
    );
    //console.log("GET NEAR DRIVERS SUCCESS: ");
    return response.data;
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", "GET NEAR DRIVERS FAILED", error);
    throw error;
  }
};

export const getCancelOptions = async (api_token) => {
  try {
    const response = await axios.get(
      "https://60219578ae8f8700177de98c.mockapi.io/api/cancel-options",
      {
        headers: {
          "taxi-zone-access-token": api_token,
        },
        //timeout: 20000,
      }
    );
    //console.log("GET CANCEL OPTIONS SUCCESS: ");
    return response.data;
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", "GET CANCEL OPTIONS FAILED", error);
    throw error;
  }
};

export const getMaintenanceState = async (api_token) => {
  try {
    const response = await axios.get(
      "https://60219578ae8f8700177de98c.mockapi.io/api/maintenance-state",
      {
        headers: {
          "taxi-zone-access-token": api_token,
        },
        //timeout: 20000,
      }
    );
    //console.log("GET MAINTENANCE STATE SUCCESS: ");
    return response.data;
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", "GET MAINTENANCE STATE FAILED", error);
    throw error;
  }
};
