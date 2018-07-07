const Administrator = require('../models/Schema/Administrator')
const Validator = require('../utils/valid')
const md5 = require('md5')
const jsonwebtoken = require('jsonwebtoken')
const { config, jwtConf } = require('../config')
const {
  findByIdAndDelete,
  findByIdAndUpdate,
  find
} = require('./utils')

class Admin {
  // 添加管理员
  static async add(ctx) {
    const { body } = ctx.request
    // 验证数据的合法性
    let validator = new Validator()
    validator.add(body.account, [{ strategy: 'isNonEmpty', errorMsg: '账号不能为空' },{ strategy: 'isEmail', errorMsg: '请输入合法的邮箱地址' }])
    validator.add(body.password, [{ strategy: 'isNonEmpty', errorMsg: '密码不能为空' },{ strategy: 'isPassword', errorMsg: '密码为8至18位字符' }])
    validator.add(body.name, [{ strategy: 'isNonEmpty', errorMsg: '用户名不能为空' }])
    let validErr = validator.start()
    validator = null
    if(validErr) {
      ctx.status = 400
      ctx.body = { msg: validErr }
      return
    }

    try {
      // 密码加密
      body.password = md5(md5(body.password+config.password))
      let d = await Administrator.findOne({ account: body.account })
      if(d) {
        ctx.status = 406
        ctx.body = { msg: '账号已存在' }
      } else {
        let admin = new Administrator(body)
        await admin.save()
        ctx.status = 200
        ctx.body = {
          msg: '添加成功',
          account: body.account,
          name: body.name,
          firstTime: Date.now(),
          lastTime: Date.now(),
          status: true,
          mobile: body.mobile,
          id: '请刷新页面',
          token: jsonwebtoken.sign({
            account: body.account,
            name: body.name,
            exp: jwtConf.exp
          }, jwtConf.secret)
        }
        admin = null
      }
    } catch (error) {
      ctx.throw(500)
    }
  }

  // 删除管理员
  static async delete(ctx) {
    const id = ctx.params.id
    if(!id) {
      ctx.status = 400
      ctx.body = { msg: '请输入id' }
      return
    }
    try {
      const res = findByIdAndDelete(id, Administrator)
      if(!!res) {
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

  // 禁用/启用 管理员
  static async able(ctx) {
    const { body } = ctx.request
    const id = body.id
    if(!id) {
      ctx.status = 400
      ctx.body = { msg: '请输入id' }
      return
    }
    delete body['id']
    try {
      const res = await findByIdAndUpdate(id, body, Administrator)
      ctx.status = 200
      ctx.body = { msg: '操作成功' }
    } catch (error) {
      ctx.throw(500)
    }
  }

  // 读取管理列表
  static async getAll(ctx) {
    try {
      const res = await find(ctx, Administrator, {}, 'name account _id account firstTime lastTime status mobile')
      if(!!res.list) {
        ctx.status = 200
        ctx.body = res
      } else {
        ctx.status = 410
        ctx.body = { msg: '暂无数据' }
      }
    } catch (error) {
      ctx.throw(500)
    }
  }
}

module.exports = Admin
