const { db } = require('../config')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

mongoose.connect(db.url)

mongoose.connection.once('connected', () => {
  console.log('connected mongoodb!')
})

mongoose.connection.on('error', err => {
  console.log('连接出错')
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected')
})

module.exports = mongoose