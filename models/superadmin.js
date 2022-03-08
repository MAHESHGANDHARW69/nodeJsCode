'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SuperAdmin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SuperAdmin.init({
    userType: DataTypes.STRING,
    profilePhoto: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    email: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    password: DataTypes.STRING,
    isDeactivated: DataTypes.BOOLEAN,
    updateAt: DataTypes.DATE,
    isVarified: DataTypes.BOOLEAN,
    resetToken: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SuperAdmin',
  });
  return SuperAdmin;
};