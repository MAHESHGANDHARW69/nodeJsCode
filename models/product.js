'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    price: DataTypes.INTEGER,
    delivery: DataTypes.STRING,
    highlight: DataTypes.STRING,
    services: DataTypes.STRING,
    availableOffer: DataTypes.STRING,
    color: DataTypes.STRING,
    updateAt: DataTypes.DATE,
    createdAt: DataTypes.STRING,
    size: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};