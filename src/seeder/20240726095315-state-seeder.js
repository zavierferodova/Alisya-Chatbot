'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('States', [
      {
        id: 1,
        takeover: false,
        publicFunction: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down() {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
