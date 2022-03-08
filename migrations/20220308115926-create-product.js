'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.INTEGER
      },
      delivery: {
        type: Sequelize.STRING
      },
      highlight: {
        type: Sequelize.STRING
      },
      services: {
        type: Sequelize.STRING
      },
      availableOffer: {
        type: Sequelize.STRING
      },
      color: {
        type: Sequelize.STRING
      },
      updateAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        type: Sequelize.STRING
      },
      size: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Products');
  }
};