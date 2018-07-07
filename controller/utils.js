// 根据id删除
exports.findByIdAndDelete = (id, model) => {
  return new Promise(async (resolve, reject) => {
    try {
      const d = await model.findByIdAndDelete({_id: id})
      resolve(d)
    } catch (error) {
      reject(error)
    }
  })
}

// 根据id更新
exports.findByIdAndUpdate = async (id, params, model) => {
  return new Promise(async (resolve, reject) => {
    try {
      const d = await model.findByIdAndUpdate({ _id: id }, { $set: params })
      resolve(d)
    } catch (error) {
      reject(error)
    }
  })
}

// 遵循restful规范的获取所有
exports.find = (ctx, model, conditions={}, options='') => {
  return new Promise(async (resolve, reject) => {
    const p = ctx.query
    let count = 0
    let limit = p.limit || 10
    let page = p.page || 0
    let sort = p.sort || { '_id': -1 }
    try {
      if(!count) {
        count = await model.count()
      }
      const list = await model.find(conditions, options).skip(page * limit).limit(limit).sort(sort)
      resolve({ list, count, limit, page, sort })
    } catch (error) {
      reject(error)
    }
  })
}
