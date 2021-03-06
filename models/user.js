const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class User extends Model{}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.TEXT,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: {
        msg: 'Valdidation isEmail on username failed'
      },
    }
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  passwordHash: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user'
})

module.exports = User
