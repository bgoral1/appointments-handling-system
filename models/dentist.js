const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dentistSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  daysOff: {
    type: String,
    required: true,
  },
  workingTime: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Dentist', dentistSchema);
