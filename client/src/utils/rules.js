export const rules = {
	phoneNumber: {
		pattern: {
			value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
			message: 'Số điện thoại không hợp lệ',
		},
	},
	password: {
		required: {
			value: true,
			message: 'Mật khẩu là bắt buộc',
		},
		minLength: {
			value: 8,
			message: 'Mật khẩu phải chứa ít nhất 8 kí tự',
		},
	},
};
