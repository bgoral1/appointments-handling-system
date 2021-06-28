const Service = require('../../models/service');
const { transformService } = require('./merge');

module.exports = {
  services: () => {
    return Service.find()
      .then((services) => {
        return services.map((service) => {
          return transformService(service);
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
        return transformService(res);
      })
      .catch((err) => {
        throw err;
      });
  },
};
