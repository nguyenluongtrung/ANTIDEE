import axios from 'axios';

const API_URL = '/antidee/api/vouchers/';

const getAllVouchers = async () => {
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

  const response = await axios.patch(`${API_URL}${id}`, voucherData, config);
  return response.data.data.updatedVoucher;
};

const deleteVoucher = async (token, id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${API_URL}${id}`, config);
  return response.data.data.id;
};

const redeemVoucher = async (token, userId, voucherId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${API_URL}redeemVoucher`, { userId, voucherId }, config);
  return response.data.data.voucher;
};

const getRedeemedVouchers = async (token, userId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}redeemed/${userId}`, config);
  console.log("Response data:", `${API_URL}redeemed/${userId}`);

  let redeemedVouchers = response.data.data || []; 
  console.log("Redeemed vouchers:",redeemedVouchers);
  return redeemedVouchers;
};

const voucherService = {
  getAllVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  redeemVoucher,
  getRedeemedVouchers,
};

export default voucherService;
