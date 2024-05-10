export const rules = {
	phoneNumber: {
		pattern: {
			value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
			message: 'Số điện thoại không hợp lệ',
		},
		required: {
			value: true,
			message: 'Số điện thoại là bắt buộc',
		},
	},
	email: {
		pattern: {
			value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/,
			message: 'Email không hợp lệ',
		},
		required: {
			value: true,
			message: 'Email là bắt buộc',
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
	name: {
		required: {
			value: true,
			message: 'Tên là bắt buộc',
		},
	},
	dob: {
		required: {
			value: true,
			message: 'Ngày sinh là bắt buộc',
		},
	},
};
