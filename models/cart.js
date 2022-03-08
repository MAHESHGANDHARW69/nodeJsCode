'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cart.init({
    userId: DataTypes.STRING,
    products: DataTypes.ARRAY(DataTypes.STRING),
    isOrderPlaced: DataTypes.BOOLEAN,
    paymentMethod: DataTypes.STRING,
    expectedDelivery: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};

// npx sequelize-cli model:generate --name Cart --attributes userId:string,products:array:string,isOrderPlaced:boolean,paymentMethod:string,expectedDelivery:Date