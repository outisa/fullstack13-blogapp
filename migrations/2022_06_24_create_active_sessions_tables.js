const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('active_sessions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      active_session_token: {
        type: DataTypes.TEXT,
        allowNull:false,
      },
    })
    await queryInterface.createTable('user_sessions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
        refereces: { model: 'users', key: 'id'},
      },
      active_session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        refereces: { model: 'active_sessions', key: 'id'}
      }
    }) 
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('active_sessions')
    await queryInterface.dropTable('user_sessions')
  }
}