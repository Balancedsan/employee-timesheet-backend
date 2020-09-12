'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.bulkInsert('users', [{
        firstName: 'John',
        lastName:"wee",
        job:"Barista"
      }], {});
    
  },

  down: async (queryInterface, Sequelize) => {

  
      await queryInterface.bulkDelete('users', null, {});

  }
};
