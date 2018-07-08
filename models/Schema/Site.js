const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Site = new Schema({
  logo: String,
  name: String,
  keyword: String,
  description: String,
  count: String,
  id: {
    type: Number,
    default: 1
  }
})

module.exports = mongoose.model('Site', Site)