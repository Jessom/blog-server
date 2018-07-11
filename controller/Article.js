const articleModel = require('../models/Schema/Article')
const Validator = require('../utils/valid')
const {
  findByIdAndDelete,
  findByIdAndUpdate,
  find
} = require('./utils')

class Article {
  // 添加文章
  static async add(ctx) {
    const { body } = ctx.request
    let validator = new Validator()
    validator.add(body.title, [{ strategy: 'isNonEmpty', errorMsg: '请填写标题' }])
    validator.add(body.content, [{ strategy: 'isNonEmpty', errorMsg: '请填写内容' }])
    let validErr = validator.start()
    validator = null
    if(body.type != 0 && body.originalText=='') {
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
    const id = ctx.params.id
    if(!id) {
      ctx.status = 400
      ctx.body = { msg: '请输入id' }
      return
    }

    try {
      const d = await articleModel.findByIdAndDelete(id)
      if(!!d) {
        ctx.status = 200
        ctx.body = { msg: '删除成功' }
      } else {
        ctx.status = 410
        ctx.body = { msg: '没有该数据，请重新操作' }
      }
    } catch (error) {
      ctx.throw(500)
    }
  }

  // 修改文章
  static async update(ctx) {
    const { body } = ctx.request
    const id = body.id
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
    delete body['id']
    try {
      const res = await findByIdAndUpdate(id, body, articleModel)
      ctx.status = 200
      ctx.body = { msg: '操作成功' }
    } catch (error) {
      
    }
  }

  // 获取所有文章
  static async getAll(ctx) {
    try {
      const res = await find(ctx, articleModel, {}, '-content')
      if(!!res.list) {
        ctx.status = 200
        ctx.body = res
      } else {
        ctx.status = 410
        ctx.body = { msg: '暂无数据' }
      }
    } catch (error) {
      
    }
  }

  // 获取文章
  static async gain(ctx) {
    try {
      const id = ctx.params.id
      let d = await articleModel.findById(id)
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