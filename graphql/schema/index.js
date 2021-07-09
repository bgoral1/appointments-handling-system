const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Appointment {
      _id: ID!
      dentist: Dentist!
      patient: Patient!
      service: Service!
      startTime: String!
      endTime: String!
    }

    type Service {
       _id: ID!
       name: String!
       duration: Int!
       price: Int!
     }

    type Patient {
      _id: ID!
      firstName: String!
      lastName: String!
      phone: Int!
    }

    type User {
      _id: ID!
      firstName: String!
      lastName: String!
      login: String!
      password: String
    }

    type AuthData {
      userId: ID!
      token: String!
      tokenExp: Int!
    }

    type WorkingTime {
      startTime: String!
      endTime: String!
    }

    type Dentist {
      _id: ID!
      workingTime: [WorkingTime]!
      user: User!
    }

    input PatientInput {
      firstName: String!
      lastName: String!
      phone: Int!
    }

    input UserInput {
      firstName: String!
      lastName: String!
      login: String!
      password: String!
    }

    input WorkingTimeInput {
      startTime: String!
      endTime: String!
    }

    input DentistInput {
      userId: String!
      workingTime: [WorkingTimeInput]!
    }

    input ServiceInput {
      name: String!
      duration: Int!
      price: Int!
    }

    input AppointmentInput {
      startTime: String!
      patientId: ID!
      serviceId: ID!
      dentistId: ID!
    }

    type RootQuery {
      services: [Service!]!
      patients: [Patient!]!
      dentists: [Dentist!]!
      appointments: [Appointment!]!
      login(login: String!, password: String!): AuthData!
    }

    type RootMutation {
      createService(serviceInput: ServiceInput): Service
      deleteService(serviceId: ID!): Service
      createPatient(patientInput: PatientInput): Patient
      deletePatient(patientId: ID!): Patient
      createUser(userInput: UserInput): User
      createDentist(dentistInput: DentistInput): Dentist
      createAppointment(appointmentInput: AppointmentInput): Appointment!
      cancelAppointment(appointmentId: ID!): Appointment
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `);
