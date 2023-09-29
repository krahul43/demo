/**
 *
 * @param {*} mail mail to be tested
 */
export const testEmail = (mail = "") => {
  console.log(mail, typeof mail);
  return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    mail
  );
};

export const testText = (name) => {
  return /^[a-zA-Z\s]*$/.test(name);
};

export const testNumber = (number) => {
  return /^\d+$/.test(number);
};

/**
 * @function
 * @description recieves a phone number and return it with or without indicative
 * @param {String} phone_number phone number with indicative or without it.
 * @param {Boolean} indicative Flag to verify if returns phone_number with indicative or not
 */

//* FUNCION QUE AGREGA EL INDICATIVO A UN NUMERO SI NO LO TIENE
export const phoneUsername = (phone_number, indicative = false) => {
  return indicative
    ? phone_number.indexOf("+") == -1
      ? `+${phone_number}`
      : phone_number
    : phone_number.indexOf("+") == -1
    ? phone_number
    : phone_number.replace("+", "");
};

export const sortAscending = (data) => {
  const copy = data;
  copy.sort((a, b) => {
    if (a.DocumentType.id > b.DocumentType.id) return 1;
    if (b.DocumentType.id > a.DocumentType.id) return -1;
    return 0;
  });
  return copy;
};

export const capitalize = (str = "") => {
  if (typeof str != "string") return;
  if (!str.length) return;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const distanceWithMeasurement = (distance) => {
  const dist =
    distance >= 1000 ? `${(distance / 1000).toFixed(1)} Km` : `${distance} Mt`;
  return dist.toLowerCase().indexOf("nan") === -1 ? dist : "Calculando....";
};
