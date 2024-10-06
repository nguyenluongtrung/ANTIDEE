import axios from 'axios';

const API_URL = '/antidee/api/promotions/';

// Get all promotions
const getAllPromotions = async () => {
	const response = await axios.get(API_URL);
	return response.data.data.promotions;
};

// Get promotion
const getPromotion = async (promotionId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL + `/${promotionId}`, config);
	return response.data.data.promotion;
};

// Delete promotion
const deletePromotion = async (promotionId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.delete(API_URL + `/${promotionId}`, config);
	return response.data.data.oldPromotion;
};

// Create promotion
const createPromotion = async (promotionData, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.post(API_URL, promotionData, config);
	console.log(response.data);
	return response.data.data.newPromotion;
};

// Update promotion
const updatePromotion = async (token, promotionData, promotionId) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(
		API_URL + `/${promotionId}`,
		promotionData,
		config
	);
	return response.data.data.updatedPromotion;
};

const updatePromotionQuantity =async (token, promotionId, quantity)=>{
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.patch(
		API_URL + `updateQuantity/${promotionId}`,
		{quantity},
		config
	);
	return response.data.data.updatedPromotion;
}

const promotionService = {
	getAllPromotions,
	deletePromotion,
	createPromotion,
	updatePromotion,
	getPromotion,
	updatePromotionQuantity,
};
export default promotionService;