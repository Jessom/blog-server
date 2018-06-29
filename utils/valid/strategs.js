const regex = require('./regex')

module.exports = {
	// 判断是否为空
	isNonEmpty(value, errorMsg) {
		return !value ? errorMsg : 0
	},
	// 最小长度
	minLength(value, length, errorMsg) {
		return value.length < length ? errorMsg : 0
	},
	// 最大长度
	maxLength(value, length, errorMsg) {
		return value > length ? errorMsg : 0
	},
	// 是否是手机号
	isMobile(value, errorMsg) {
		return !regex.mobile.test(value) ? errorMsg : 0
	},
	// 是否是邮箱
	isEmail(value, errorMsg) {
		return !regex.email.test(value) ? errorMsg : 0
	},
	// 密码
	isPassword(value, errorMsg) {
		return !regex.password.test(value) ? errorMsg : 0
	}
}