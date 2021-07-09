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
  deletePatient: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    try {
      const patient = await Patient.findById(args.patientId);
      await Patient.deleteOne({ _id: args.patientId });
      return patient;
    } catch (err) {
      throw err;
    }
  },
};
