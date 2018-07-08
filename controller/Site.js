const SiteCollection = require('../models/Schema/Site')
const qiniuUpload = require('./Basic')

class Site {
  static async update(ctx) {
    const { body } = ctx.request
    const id = body._id
    if(!id) {
      ctx.status = 400
      ctx.body = { msg: '请输入id' }
      return
    }
    try {
      delete body['_id']
      const d = await SiteCollection.findByIdAndUpdate({_id: id}, {$set: body})
      ctx.status = 200
      ctx.body = { msg: '操作成功' }
    } catch (error) {
      ctx.throw(500)
    }
  }

  static async add(ctx) {
    const { body } = ctx.request
    if(body.id !== 1) {
      ctx.status = 400
      ctx.bodu = { msg: '错误的id值' }
      return
    }
    try {
      let s = new SiteCollection(body)
      await s.save()
      ctx.status = 200
      ctx.body = { msg: '操作成功' }
    } catch (error) {
      ctx.throw(500)
    }
  }

  static async agni(ctx) {
    try {
      const d = await SiteCollection.find({id: 1})
      if(!!d) {
        ctx.status = 200
        ctx.body = d
      } else {
        ctx.status = 410
        ctx.body = { msg: '没有数据' }
      }
    } catch (error) {
      ctx.throw(500)
    }
  }

  static async logo(ctx) {
    try {
      let d = await qiniuUpload(ctx)
      let r = await SiteCollection.findOneAndUpdate({id: 1}, {$set: {logo: d.url}})
      ctx.status = 200
      ctx.body = { msg: '操作成功' }
    } catch (error) {
      ctx.throw(500)
    }
  }
}

module.exports = Site
