const moment = require('moment');

exports.dateToFormat = (date) => moment(date).format();

exports.addMinutesToDate = (start, duration) =>
  moment(start).add(duration, 'm').toDate();
