const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class UserSession extends Model{}

UserSession.init({
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  activeSessionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'active_sessions', key: 'id' },
  },
  }, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user_sessions'
})

module.exports = UserSession