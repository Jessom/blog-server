const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Types = new Schema({
  name: { type: String, required: true },
  status: { type: Boolean, default: true },
  firstTime: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('type', Types)
