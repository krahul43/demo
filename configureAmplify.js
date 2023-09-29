import AsyncStorage from "@react-native-community/async-storage";
import Amplify, { Auth } from "aws-amplify";
import awsConfig from "./aws-exports";

const MEMORY_KEY_PREFIX = "@StorageService:";
let dataMemory = {};

/** @class */
export class MemoryStorageNew {
  static syncPromise = null;
  /**
   * This is used to set a specific item in storage
   * @param {string} key - the key for the item
   * @param {object} value - the value
   * @returns {string} value that was set
   */
  static setItem(key, value) {
    AsyncStorage.setItem(MEMORY_KEY_PREFIX + key, value);
    dataMemory[key] = value;
    return dataMemory[key];
  }

  /**
   * This is used to get a specific key from storage
   * @param {string} key - the key for the item
   * This is used to clear the storage
   * @returns {string} the data item
   */
  static getItem(key) {
    return Object.prototype.hasOwnProperty.call(dataMemory, key)
      ? dataMemory[key]
      : undefined;
  }

  /**
   * This is used to remove an item from storage
   * @param {string} key - the key being set
   * @returns {string} value - value that was deleted
   */
  static removeItem(key) {
    AsyncStorage.removeItem(MEMORY_KEY_PREFIX + key);
    return delete dataMemory[key];
  }

  /**
   * This is used to clear the storage
   * @returns {string} nothing
   */
  static clear() {
    dataMemory = {};
    return dataMemory;
  }

  static async getAllItems() {
    const dmemory = {};
    const getDataPromise = () =>
      new Promise((resolve, reject) =>
        AsyncStorage.getAllKeys((errKeys, keys) => {
          if (errKeys) reject(errKeys);
          const memoryKeys = keys?.filter((key) =>
            key.startsWith(MEMORY_KEY_PREFIX)
          );
          AsyncStorage.multiGet(memoryKeys, (err, stores) => {
            if (err) reject(err);
            stores?.map((result, index, store) => {
              const key = store[index][0];
              const value = store[index][1];
              const memoryKey = key.replace(MEMORY_KEY_PREFIX, "");
              dmemory[memoryKey] = value;
            });
            resolve();
          });
        })
      );
    await getDataPromise();
    return dmemory;
  }

  /**
   * Will sync the MemoryStorage data from AsyncStorage to storageWindow MemoryStorage
   * @returns {void}
   */
  static sync() {
    if (!MemoryStorageNew.syncPromise) {
      MemoryStorageNew.syncPromise = new Promise((res, rej) => {
        AsyncStorage.getAllKeys((errKeys, keys) => {
          if (errKeys) rej(errKeys);
          const memoryKeys = keys?.filter((key) =>
            key.startsWith(MEMORY_KEY_PREFIX)
          );
          AsyncStorage.multiGet(memoryKeys, (err, stores) => {
            if (err) rej(err);
            stores?.map((result, index, store) => {
              const key = store[index][0];
              const value = store[index][1];
              const memoryKey = key.replace(MEMORY_KEY_PREFIX, "");
              dataMemory[memoryKey] = value;
            });
            res();
          });
        });
      });
    }
    return MemoryStorageNew.syncPromise;
  }
}

/** @class */
export default class StorageHelper {
  storageWindow;
  /**
   * This is used to get a storage object
   * @returns {object} the storage
   */
  constructor() {
    this.storageWindow = MemoryStorageNew;
  }

  /**
   * This is used to return the storage
   * @returns {object} the storage
   */
  getStorage() {
    return this.storageWindow;
  }
}

Amplify.configure({ ...awsConfig, Auth: { storage: MemoryStorageNew } });

//* FUNCION QUE CHECKEA SI HAY UN USUARIO EN EL POOL DE AWS QUE ES COMO UN STORAGE DEL CELULAR (PARECE), ESTO SE CREA APENAS EL USUARIO HACE SIGN IN, ES NECESARIO LIMIPAR ESTE POOL PARA QUE SE HAGAN DEMAS VALIDACIONES QUE NO SON CAPTURADAS POR LE SIGN IN DE AWS
export const getAuthenticatedUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await Auth.currentUserPoolUser();
      resolve(user);
    } catch (error) {
      resolve(null);
    }
  });
};
