const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  dentist: {
    type: Schema.Types.ObjectId,
    ref: 'Dentist',
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
