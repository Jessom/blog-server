/*
* @Author: watasi
* @Date:   2018-06-07 16:43:14
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-06-29 09:14:11
*/
const strategs = require('./strategs')

/**
 * 使用方法
 * const validator = new Validator()
 * validator.add('jessoncheung@gmail.com', [
 * 	{ strategy: 'isNonEmpty', errorMsg: '邮箱地址不能为空' },
 * 	{ strategy: 'isEmail', errorMsg: '请输入合法的邮箱地址' }
 * ])
 *
 * validator.start()
 */
class Validator {
	constructor() {
		// 保存校验规则
		this.cache = []
	}
	add(value, rules) {
		for(let rule of rules) {
			// 已:分割出校验方法 和参数
			let strategyAry = rule.strategy.split(':')
			let errorMsg = rule.errorMsg
			this.cache.push(() => {
				// 获取选择的校验方法
				let strategy = strategyAry.shift()
				// 把value添加至参数列表
				strategyAry.unshift(value)
				// 把错误信息添加至参数列表
				strategyAry.push(errorMsg)

				return strategs[strategy].apply(value, strategyAry)
			})
		}
	}
	start() {
		for(let validatorFunc of this.cache) {
			// 开始校验，并获取返回值
			let errorMsg = validatorFunc()
			if(errorMsg) {
				return errorMsg
			}
		}
	}
}

module.exports = Validator