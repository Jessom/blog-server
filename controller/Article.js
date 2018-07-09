const articleModel = require('../models/Schema/Article')
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
    if(body.type != 1 && body.originalText=='') {
      validErr = '请输入原文地址'
    }
    if(validErr) {
      ctx.status = 400
      ctx.body = { msg: validErr }
      return
    }
    try {
      console.log(body)
      let art = new articleModel(body)
      await art.save()
      ctx.status = 200
      ctx.body = {
        msg: '添加成功'
      }
      art = null
    } catch (error) {
      ctx.throw(500)
    }
  }

  // 删除文章
  static async delete(ctx) {

  }

  // 修改文章
  static async update(ctx) {
    
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
        ctx.body = { msg: '文章不存在' }
      }
    } catch (error) {
      ctx.throw(500)
    }
  }
}

module.exports = Article