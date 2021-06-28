const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  dentist: {
    type: Schema.Types.ObjectId,
    ref: 'Dentist',
  },
});

module.exports = mongoose.model('Patient', patientSchema);
