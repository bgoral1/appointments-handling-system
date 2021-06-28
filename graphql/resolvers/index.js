const bcrypt = require('bcryptjs');
const moment = require('moment');

const Service = require('../../models/service');
const Patient = require('../../models/patient');
const User = require('../../models/user');
const Dentist = require('../../models/dentist');
const Appointment = require('../../models/appointment');

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
      return { ...service._doc, _id: service.id };
    })
    .catch((err) => {
      throw err;
    });
};

const dentistData = (dentistId) => {
  return Dentist.findById(dentistId)
    .then((dentist) => {
      return {
        ...dentist._doc,
        _id: dentist.id,
        user: userData.bind(this, dentist._doc.user),
      };
    })
    .catch((err) => {
      throw err;
    });
};

const patientData = (patientId) => {
  return Patient.findById(patientId)
    .then((patient) => {
      return { ...patient._doc, _id: patient.id };
    })
    .catch((err) => {
      throw err;
    });
};

module.exports = {
  services: () => {
    return Service.find()
      .then((services) => {
        return services.map((service) => {
          return { ...service._doc, _id: service._doc._id.toString() };
        });
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  dentists: () => {
    return Dentist.find()
      .then((dentists) => {
        return dentists.map((dentist) => {
          return {
            ...dentist._doc,
            _id: dentist.id,
            user: userData.bind(this, dentist._doc.user),
          };
        });
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  appointments: () => {
    return Appointment.find()
      .then((appointments) => {
        return appointments.map((appointment) => {
          return {
            ...appointment._doc,
            _id: appointment._doc._id.toString(),
            dentist: dentistData.bind(this, appointment._doc.dentist),
            patient: patientData.bind(this, appointment._doc.patient),
            service: serviceData.bind(this, appointment._doc.service),
            startTime: moment(appointment._doc.startTime).format(
              'DD-MM-YYYY HH:mm'
            ),
            endTime: moment(appointment._doc.endTime).format(
              'DD-MM-YYYY HH:mm'
            ),
          };
        });
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  createService: (args) => {
    const service = new Service({
      name: args.serviceInput.name,
      duration: args.serviceInput.duration,
      price: args.serviceInput.price,
    });

    return service
      .save()
      .then((res) => {
        // res._doc._id.toString() is the same as res.id
        return { ...res._doc, _id: res._doc._id.toString() };
      })
      .catch((err) => {
        throw err;
      });
  },
  createUser: (args) => {
    return User.findOne({ login: args.userInput.login }).then((user) => {
      if (user) {
        throw new Error('User with this login already exist.');
      }
      return bcrypt
        .hash(args.userInput.password, 12)
        .then((hashedPassword) => {
          const user = new User({
            firstName: args.userInput.firstName,
            lastName: args.userInput.lastName,
            login: args.userInput.login,
            password: hashedPassword,
          });
          return user.save();
        })
        .then((res) => {
          return {
            ...res._doc,
            password: null,
            _id: res._doc._id.toString(),
          };
        })
        .catch((err) => {
          throw err;
        });
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
          throw new Error('Patient already exist.');
        } else {
          return patient.save().then((res) => {
            return { ...res._doc, _id: res._doc._id.toString() };
          });
        }
      })
      .catch((err) => {
        throw err;
      });
  },
  createDentist: (args) => {
    const dentist = new Dentist({
      daysOff: args.dentistInput.daysOff,
      workingTime: args.dentistInput.workingTime,
      user: '60d4b80ad987e34d547c377c',
    });

    // !!! Add prevention from saving another dentist with the same user
    //
    // const checkedUser = userData.bind(args.dentistInput.user);
    // return Dentist.findOne({ user: checkedUser })
    //   .then((user) => {
    //     if (user) {
    //       throw new Error('Dentist already exist.');
    //     } else {
    //       return dentist.save().then((res) => {
    //         return {
    //           ...res._doc,
    //           _id: res._doc._id.toString(),
    //           user: userData.bind(this, res._doc.user),
    //         };
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     throw err;
    //   });

    return dentist
      .save()
      .then((res) => {
        return {
          ...res._doc,
          _id: res._doc._id.toString(),
          user: userData.bind(this, res._doc.user),
        };
      })
      .catch((err) => {
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

    const start = moment().format();
    const end = moment(start).add(fetchedService.duration, 'm').toDate();

    const appointment = new Appointment({
      patient: fetchedPatient,
      dentist: fetchedDentist,
      service: fetchedService,
      startTime: start,
      endTime: end,
    });

    const res = await appointment.save();
    return {
      ...res._doc,
      _id: res.id,
      dentist: dentistData.bind(this, appointment._doc.dentist),
      patient: patientData.bind(this, appointment._doc.patient),
      service: serviceData.bind(this, appointment._doc.service),
      startTime: moment(res.startTime).format('DD-MM-YYYY HH:mm'),
      endTime: moment(res.endTime).format('DD-MM-YYYY HH:mm'),
    };
  },
};
