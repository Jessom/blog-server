const article = require('../models/Schema/Article')
const Validator = require('../utils/valid')

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

  }

  // 修改文章
  static async update(ctx) {

  }

  // 获取文章
  static async gain(ctx) {
    try {
      const url = ctx.url
      const id = url.split('/')[url.split('/').length-1]
      let d = await article.findById(id).populate({path: 'author', select: 'name account'})
      ctx.body = d
    } catch (error) {
      ctx.throw(500)
    }
  }
}

module.exports = Article