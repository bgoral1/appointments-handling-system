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
        throw err;
      });
  },
  createService: (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
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
  deleteService: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    try {
      const service = await Service.findById(args.serviceId);
      await Service.deleteOne({ _id: args.serviceId });
      return service;
    } catch (err) {
      throw err;
    }
  },
};
