const bcrypt = require('bcryptjs');

const User = require('../../models/user');

module.exports = {
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
            _id: res.id,
          };
        })
        .catch((err) => {
          throw err;
        });
    });
  },
};
