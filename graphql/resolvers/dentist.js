const Dentist = require('../../models/dentist');
const { transformDentist } = require('./merge');

module.exports = {
  dentists: () => {
    return Dentist.find()
      .then((dentists) => {
        return dentists.map((dentist) => {
          return transformDentist(dentist);
        });
      })
      .catch((err) => {
        throw err;
      });
  },
  createDentist: (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error('Unauthenticated');
    // }
    const dentist = new Dentist({
      user: args.dentistInput.userId,
      workingTime: args.dentistInput.workingTime,
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
        return transformDentist(res);
      })
      .catch((err) => {
        throw err;
      });
  },
};
