// Exercise 13.3
const { DATABASE_URL } = require('./utils/config')
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')   
    const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
    blogs.forEach(element => {
      console.log(`${element.author}: ${element.title}, ${element.likes} likes`)
    });
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}   
main()