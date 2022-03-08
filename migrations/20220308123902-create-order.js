'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.STRING
      },
      productId: {
        type: Sequelize.STRING
      },
      orderPlaced: {
        type: Sequelize.BOOLEAN
      },
      expectedDelivery: {
        type: Sequelize.DATE
      },
      isOrderDispatched: {
        type: Sequelize.BOOLEAN
      },
      isPaymentReceived: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};