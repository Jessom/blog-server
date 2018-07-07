// 根据id删除
exports.findByIdAndDelete = async (ctx, model, validMsg='请填写id', errMsg='操作失败', successMsg='删除成功') => {
  const { body } = ctx.request
  if(!body.id) {
    ctx.status = 400
    ctx.body = { code: 400, msg: validMsg }
    return
  }
  try {
    const d = await model.findByIdAndDelete({_id: body.id})
    console.log(d)
    if(!!d) {
      ctx.status = 200
      ctx.body = { msg: successMsg }
    } else {
      ctx.status = 410
      ctx.body = { code: 410, msg: errMsg }
    }
  } catch (error) {
    ctx.throw(500)
  }
}

// 根据id更新
exports.findOneAndUpdate = async (ctx, model, validMsg='请填写id', errMsg='操作失败', successMsg='操作成功') => {
  const { body } = ctx.request
  if(!body.id) {
    ctx.status = 400
    ctx.body = { code: 400, msg: validMsg }
    return
  }
  delete body['id']
  try {
    const d = await model.findOneAndUpdate({ _id: body.id }, { $set: body })
    if(!!d) {
      ctx.status = 200
      ctx.body = { msg: successMsg }
    } else {
      ctx.status = 410
      ctx.body = { msg: errMsg }
    }
  } catch (error) {
    ctx.throw(500)
  }
}

// 遵循restful规范的获取所有
exports.find = async (ctx, model, errMsg='操作失败') => {
  const p = ctx.query
  let count = 0
  let limit = p.limit || 10
  let page = p.page || 1
  let sort = p.sort || { '_id': -1 }
  try {
    if(count) {
      count = await model.count()
    }
    const list = await model.find({}).skip(page * limit).limit(limit).sort(sort)
    if(!!list) {
      ctx.status = 200
      ctx.body = { list, count, limit, page, sort }
    } else {
      ctx.status = 410
      ctx.body = { msg: errMsg }
    }
  } catch (error) {
    ctx.throw(500)
  }
}
