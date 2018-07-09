const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Article = new Schema({
  title: { type: String, required: [true, '请输入文章标题'] },
  originalText: { type: String },
  content: { type: String, required: [true, '请输入文字内容'] },
  author: { type: Schema.Types.ObjectId, ref: 'administrator', required: [true, '请传如当前用户id'] },
  // 原创0，转载1，翻译2
  type: { type: Number },
  // 推荐 置顶
  hand: [String],
  // 标签
  tag: String,
  firstTime: { type: Date, default: Date.now() },
  lastTime: { type: Date, default: Date.now() },
  status: { type: Boolean, default: true }
})

module.exports = mongoose.model('article', Article)