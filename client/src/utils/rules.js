export const rules = {
	phoneNumber: {
		pattern: {
			value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
			message: 'Số điện thoại không hợp lệ',
		},
	},
	email: {
		pattern: {
			value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/,
			message: 'Email không hợp lệ',
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
			message: "Không được để trống trường này",
		},
	},
	description: {
		required: {
			value: true,
			message: "Không được để trống trường này",
		},
	},
	discountValue: {
		required: {
			value: true,
			message: "Không được để trống trường này",
		},
		min: {
			value: 0,
			message: " Giá trị chiết khấu không được bé hơn 0"
		}
	},
	quantity: {
		required: {
			value: true,
			message: "Không được để trống trường này",
		},
		min: {
			value: 0,
			message: " Số lượng không được bé hơn 0"
		}
	},
	price: {
		required: {
			value: true,
			message: "Không được để trống trường này",
		},
		min: {
			value: 0,
			message: " Điểm trao đổi không được bé hơn 0"
		}
	},
	code: {
		required: {
			value: true,
			message: "Không được để trống trường này",
		},
	},
	brand: {
		required: {
			value: true,
			message: "Không được để trống trường này",
		},
	},
};
