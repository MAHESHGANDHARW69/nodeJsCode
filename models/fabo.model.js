module.exports = (sequelize, Sequelize) => {
    const Fabo = sequelize.define("facebook", {
        facebookId: {
            type: Sequelize.STRING
        },
        displayName: {
            type: Sequelize.STRING
        },
        
    });
    return Fabo;
};