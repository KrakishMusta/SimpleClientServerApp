import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert('area', [
      { name: 'ИТ' },
      { name: 'Биг Дата' },
      { name: 'Дизайн' },
      { name: 'Аналитика' },
      { name: 'Информационная безопасность' },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('area', {});
  },
};
