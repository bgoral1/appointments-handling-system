const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dentistSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  workingTime: {
    type: [
      {
        startTime: String,
        endTime: String,
      },
    ],
    required: true,
  },
});

module.exports = mongoose.model('Dentist', dentistSchema);
