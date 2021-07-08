const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
  createUser: (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error('Unauthenticated');
    // }
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
  login: async ({ login, password }) => {
    const user = await User.findOne({ login: login });
    if (!user) {
      throw new Error('User does not exist.');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect.');
    }
    const token = await jwt.sign(
      { userId: user.id, login: user.login },
      'f14tRS6#5yj9&3q241hdXNgM5',
      { expiresIn: '1h' }
    );
    return { userId: user.id, token, tokenExp: 1 };
  },
};
