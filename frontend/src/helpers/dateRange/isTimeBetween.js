import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

export const isTimeBetween = (startTime, endTime, selectedTime) => {
  let start = moment(startTime, 'H:mm');
  let end = moment(endTime, 'H:mm');
  let selected = moment(selectedTime, 'H:mm');
  if (end < start) {
    return (
      (selected >= start && selected <= moment('23:59:59', 'h:mm:ss')) ||
      (selected >= moment('0:00:00', 'h:mm:ss') && selected < end)
    );
  }
  return selected >= start && selected < end;
};
