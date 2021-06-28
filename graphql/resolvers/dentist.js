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
        console.log(err);
        throw err;
      });
  },
  createDentist: (args) => {
    const dentist = new Dentist({
      daysOff: args.dentistInput.daysOff,
      workingTime: args.dentistInput.workingTime,
      user: '60d9e1ab1691d56bdc5ef33d',
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
