const authResolver = require('./auth');
const appointmentResolver = require('./appointment');
const patientResolver = require('./patient');
const dentistResolver = require('./dentist');
const serviceResolver = require('./service');

const rootResolver = {
  ...authResolver,
  ...appointmentResolver,
  ...patientResolver,
  ...dentistResolver,
  ...serviceResolver,
};

module.exports = rootResolver;
