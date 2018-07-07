const Administrator = require('../models/Schema/Administrator')
const Validator = require('../utils/valid')
const md5 = require('md5')
const jsonwebtoken = require('jsonwebtoken')
const { config, jwtConf } = require('../config')
const {
  findByIdAndDelete,
  findOneAndUpdate
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
          msg: '注册成功',
          account: body.account,
          name: body.name,
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
    findByIdAndDelete(ctx, Administrator)
  }

  // 禁用/启用 管理员
  static async able(ctx) {
    findOneAndUpdate(ctx, Administrator)
  }

  // 读取管理列表
  static async getAll(ctx) {
    ctx.body = { msg: ctx }
    console.log(ctx.query)
  }
}

module.exports = Admin
