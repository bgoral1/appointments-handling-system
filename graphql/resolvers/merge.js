const User = require('../../models/user');
const Service = require('../../models/service');
const Dentist = require('../../models/dentist');
const Patient = require('../../models/patient');

const userData = (userId) => {
  return User.findById(userId)
    .then((user) => {
      return { ...user._doc, _id: user.id };
    })
    .catch((err) => {
      throw err;
    });
};

const serviceData = (serviceId) => {
  return Service.findById(serviceId)
    .then((service) => {
      return transformService(service);
    })
    .catch((err) => {
      throw err;
    });
};

const dentistData = (dentistId) => {
  return Dentist.findById(dentistId)
    .then((dentist) => {
      return transformDentist(dentist);
    })
    .catch((err) => {
      throw err;
    });
};

const patientData = (patientId) => {
  return Patient.findById(patientId)
    .then((patient) => {
      return transformPatient(patient);
    })
    .catch((err) => {
      throw err;
    });
};

const transformService = (service) => {
  return { ...service._doc, _id: service.id };
};

const transformDentist = (dentist) => {
  return {
    ...dentist._doc,
    _id: dentist.id,
    user: userData.bind(this, dentist._doc.user),
  };
};

const transformPatient = (patient) => {
  return { ...patient._doc, _id: patient.id };
};

exports.userData = userData;
exports.serviceData = serviceData;
exports.dentistData = dentistData;
exports.patientData = patientData;
exports.transformService = transformService;
exports.transformDentist = transformDentist;
exports.transformPatient = transformPatient;
