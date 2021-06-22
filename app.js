const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Service = require('./models/service');

const app = express();

const services = [];

app.use(express.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
    type Service {
       _id: ID!
       name: String!
       duration: Int!
     }

    input ServiceInput {
      name: String!
      duration: Int!
    }

    type RootQuery {
      services: [Service!]!
    }

    type RootMutation {
      createService(serviceInput: ServiceInput): Service
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
    rootValue: {
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
      createService: (args) => {
        const service = new Service({
          name: args.serviceInput.name,
          duration: args.serviceInput.duration,
        });

        return service
          .save()
          .then((res) => {
            console.log(res);
            // res._doc._id.toString() is the same as res.id
            return { ...res._doc, _id: res._doc._id.toString() };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
    },
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@bgoral.eu9sn.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
