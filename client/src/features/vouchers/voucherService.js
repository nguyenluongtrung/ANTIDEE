import axios from 'axios';

const API_URL = '/antidee/api/vouchers/';

const getAllVouchers = async () =>{
	const response = await axios.get(API_URL);
	return response.data.data.vouchers;
};

const createVoucher = async (token, voucherData) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.post(API_URL, voucherData, config);
	return response.data.data.voucher;
};

const updateVoucher = async (token, voucherData, id) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(API_URL + `${id}`, voucherData, config);
	return response.data.data.updatedVoucher;
};

const deleteVoucher = async (token, id) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.delete(API_URL + `${id}`, config);
	return response.data.data.id;
};
const voucherService = {
	getAllVouchers,
	updateVoucher,
	createVoucher,
	deleteVoucher,
};

export default voucherService;