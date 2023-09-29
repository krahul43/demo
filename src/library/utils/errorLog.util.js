import { dev } from "../../../env";

export const errorLog = (errorMessage, errorTitle) => {
  if(dev){
    alert(`${errorTitle}\n${JSON.stringify(errorMessage)}`)
  } else {
    console.log("\x1b[31m%s\x1b[0m",errorTitle);
    console.log("\x1b[31m%s\x1b[0m",errorMessage);
  }
}