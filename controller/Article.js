const article = require('../models/Schema/Article')
const Validator = require('../utils/valid')
const { findByIdAndDelete } = require('./utils')

class Article {
  // 添加文章
  static async add(ctx) {
    const { body } = ctx.request
    let validator = new Validator()
    validator.add(body.title, [{ strategy: 'isNonEmpty', errorMsg: '请填写标题' }])
    validator.add(body.content, [{ strategy: 'isNonEmpty', errorMsg: '请填写内容' }])
    let validErr = validator.start()
    validator = null
    if(validErr) {
      ctx.status = 400
      ctx.body = { code: 400, msg: validErr }
      return
    }
    try {
      let art = new article(body)
      await art.save()
      ctx.status = 200
      ctx.body = {
        code: 200,
        msg: '添加成功'
      }
      art = null
    } catch (error) {
      ctx.throw(500)
    }
  }

  // 删除文章
  static async delete(ctx) {
    findByIdAndDelete(ctx, article)
  }

  // 修改文章
  static async update(ctx) {
    const { title, content, status, id } = ctx.request.body
    try {
      const d = await article.findOneAndUpdate({_id: id}, {title, content, status, lastTime: Date.now()})
      if(!!d) {
        ctx.status = 200
        ctx.body = { code: 200, msg: '修改成功' }
      } else {
        ctx.status = 410
        ctx.body = { code: 410, msg: '文章不存在' }
      }
    } catch (error) {
      ctx.throw(500)
    }
  }

  // 获取文章
  static async gain(ctx) {
    try {
      const id = ctx.query.id
      let d = await article.findById(id).populate({path: 'author', select: 'name account'})
      if(!!d) {
        ctx.status = 200
        ctx.body = d
      } else {
        ctx.status = 410
        ctx.body = { code: 410, msg: '文章不存在' }
      }
    } catch (error) {
      ctx.throw(500)
    }
  }
}

module.exports = Article