const Patient = require('../../models/patient');
const { transformPatient } = require('./merge');

module.exports = {
  patients: () => {
    return Patient.find()
      .then((patients) => {
        return patients.map((patient) => {
          return transformPatient(patient);
        });
      })
      .catch((err) => {
        throw err;
      });
  },
  createPatient: (args) => {
    const patient = new Patient({
      firstName: args.patientInput.firstName,
      lastName: args.patientInput.lastName,
      phone: args.patientInput.phone,
    });

    return Patient.findOne({ phone: args.patientInput.phone })
      .then((user) => {
        if (user) {
          return user;
        } else {
          return patient.save().then((res) => {
            return transformPatient(res);
          });
        }
      })
      .catch((err) => {
        throw err;
      });
  },
};
