const typeModel = require('../models/Schema/Type')

class Type {
  // 添加类型
  static async add(ctx) {
    const { body } = ctx.request
    if(!body.name) {
      ctx.status = 400
      ctx.body = { msg: '类型名不能为空' }
      return
    }

    try {
      let r = typeModel.find({name: body.name})
      if(!!d) {
        ctx.status = 406
        ctx.body = { msg: '已存在该类型' }
        return
      }

      let d = new typeModel(body)
      await d.save()
      ctx.status = 200
      ctx.body = { msg: '添加成功', ...d._doc }
      d = null
    } catch (error) {
      ctx.throw(500)
    }
  }

  // 删除
  static async delete(ctx) {
    const id = ctx.params.id
    if(!id) {
      ctx.status = 400
      ctx.body = { msg: '请输入id' }
      return
    }

    try {
      let d = await typeModel.findByIdAndDelete(id)
      if(!d) {
        ctx.status = 410
        ctx.body = { msg: '数据不存在' }
      } else {
        ctx.status = 200
        ctx.body = { msg: '删除成功！' }
      }
    } catch (error) {
      ctx.throw(500)
    }
  }

  // 更新
  static async update(ctx) {
    const { body } = ctx.request
    const id = body.id
    if(!id) {
      ctx.status = 400
      ctx.body = { msg: '请输入id' }
      return
    }

    try {
      delete body['id']
      let d = await typeModel.findByIdAndUpdate(id, { $set: body })
      ctx.status = 200
      ctx.body = {
        msg: '操作成功',
        ...d._doc
      }
    } catch (error) {
      ctx.throw(500)
    }
  }

  // 获取
  static async getAll(ctx) {
    try {
      let d = await typeModel.find({}).sort({_id: -1})
      ctx.status = 200
      ctx.body = {
        data: d
      }
    } catch (error) {
      ctx.throw(500)
    }
  }
}

module.exports = Type
