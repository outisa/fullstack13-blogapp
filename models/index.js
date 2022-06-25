const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')
const ActiveSessions = require('./active_sessions')
const UserSession = require('./user_session')

User.hasMany(Blog)
Blog.belongsTo(User)

ActiveSessions.belongsToMany(User, {through: UserSession})
User.belongsToMany(ActiveSessions, {through: UserSession})

User.belongsToMany(Blog, {through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, {through: ReadingList, as: 'belongsToLists' })

module.exports = {
  Blog,
  User,
  ReadingList,
  ActiveSessions,
  UserSession,
}
