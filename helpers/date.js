const moment = require('moment');

exports.dateToFormat = (date) => moment(date).format('DD-MM-YYYY HH:mm');

exports.addMinutesToDate = (start, duration) =>
  moment(start).add(duration, 'm').toDate();
