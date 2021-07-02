const moment = require('moment');

const { dateToFormat, addMinutesToDate } = require('../../helpers/date');
const {
  dentistData,
  patientData,
  serviceData,
  transformService,
  transformDentist,
  transformPatient,
} = require('./merge');
const Appointment = require('../../models/appointment');
const Patient = require('../../models/patient');
const Service = require('../../models/service');
const Dentist = require('../../models/dentist');

const transformAppointment = (appointment) => {
  return {
    ...appointment._doc,
    _id: appointment.id,
    dentist: dentistData.bind(this, appointment._doc.dentist),
    patient: patientData.bind(this, appointment._doc.patient),
    service: serviceData.bind(this, appointment._doc.service),
    startTime: dateToFormat(appointment._doc.startTime),
    endTime: dateToFormat(appointment._doc.endTime),
  };
};

module.exports = {
  appointments: (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    return Appointment.find()
      .then((appointments) => {
        return appointments.map((appointment) => {
          return transformAppointment(appointment);
        });
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  createAppointment: async (args) => {
    const fetchedPatient = await Patient.findOne({
      _id: args.appointmentInput.patientId,
    });
    const fetchedService = await Service.findOne({
      _id: args.appointmentInput.serviceId,
    });
    const fetchedDentist = await Dentist.findOne({
      _id: args.appointmentInput.dentistId,
    });

    moment.locale();

    const start = moment(args.appointmentInput.startTime).format();
    const end = addMinutesToDate(start, fetchedService.duration);

    const appointment = new Appointment({
      patient: fetchedPatient,
      dentist: fetchedDentist,
      service: fetchedService,
      startTime: start,
      endTime: end,
    });

    const res = await appointment.save();
    return transformAppointment(res);
  },
  cancelAppointment: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    try {
      const appointment = await Appointment.findById(args.appointmentId);
      await Appointment.deleteOne({ _id: args.appointmentId });
      return appointment;
    } catch (err) {
      throw err;
    }
  },
};
