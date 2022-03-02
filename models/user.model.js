module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        googleId: {
            type: Sequelize.STRING
        },
        displayName: {
            type: Sequelize.STRING
        },
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        },
        image: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        }
    });
    return User;
};