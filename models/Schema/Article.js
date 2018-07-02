const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Article = new Schema({
  title: { type: String, required: [true, '请输入文章标题'] },
  content: { type: String, required: [true, '请输入文字内容'] },
  author: { type: Schema.Types.ObjectId, ref: 'administrator' },
  firstTime: { type: Date, default: Date.now() },
  lastTime: { type: Date, default: Date.now() },
  status: { type: Boolean, default: true }
})

module.exports = mongoose.model('article', Article)