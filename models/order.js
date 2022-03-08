'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    userId: DataTypes.STRING,
    productId: DataTypes.STRING,
    orderPlaced: DataTypes.BOOLEAN,
    expectedDelivery: DataTypes.DATE,
    isOrderDispatched: DataTypes.BOOLEAN,
    isPaymentReceived: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};