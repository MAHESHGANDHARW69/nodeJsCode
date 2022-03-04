module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("socials", {
    AppId: {
      type: Sequelize.STRING
    },
    displayName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },    
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    socialType: {
      type: Sequelize.STRING
    }
  });
  return User;
};