const Patient = require('../../models/patient');
const { transformPatient } = require('./merge');

module.exports = {
  createPatient: (args) => {
    const patient = new Patient({
      firstName: args.patientInput.firstName,
      lastName: args.patientInput.lastName,
      phone: args.patientInput.phone,
    });

    return Patient.findOne({ phone: args.patientInput.phone })
      .then((user) => {
        if (user) {
          throw new Error('Patient already exist.');
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
