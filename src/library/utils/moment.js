import "moment/locale/es";
import moment from "moment-timezone";
import { timezone } from "../../../env";
moment.locale("es");

export default (date = null) => {
  return date ? moment(date).tz(timezone) : moment().tz(timezone);
};

export const minutesAndSeconds = (time) => {
  // Hours, minutes and seconds
  var hrs = ~~(time / 3600);
  var mins = ~~((time % 3600) / 60);
  var secs = ~~time % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = "";
  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }
  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
};
