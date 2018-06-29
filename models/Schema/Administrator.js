const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AdministratorSchema = new Schema({
  account: { type: String, required: [true, '请填写管理员账号'] },
  password: { type: String, required: [true, '请填写管理密码'] },
  name: { type: String, required: [true, '请填写管理员名称'] },
  firstTime: { type: Date, default: Date.now() },
  mobile: { type: Number },
  lastTime: { type: Date, default: Date.now() },
  status: { type: Boolean, default: true }
})

module.exports = mongoose.model('administrator', AdministratorSchema)