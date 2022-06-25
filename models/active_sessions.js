const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class ActiveSessions extends Model{}

ActiveSessions.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  activeSessionToken: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'active_sessions'
})

module.exports = ActiveSessions
