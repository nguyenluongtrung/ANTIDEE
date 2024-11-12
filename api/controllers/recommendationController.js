const asyncHandler = require('express-async-handler');
const AccountService = require('./../models/accountServiceModel');

// Hàm tính cosine similarity
function cosineSimilarity(matrix1, matrix2) {
	const dotProduct = (vec1, vec2) =>
		vec1.reduce((sum, value, index) => sum + value * vec2[index], 0);
	const magnitude = (vec) =>
		Math.sqrt(vec.reduce((sum, value) => sum + value * value, 0));

	const similarity = [];
	for (let i = 0; i < matrix1.length; i++) {
		similarity.push([]);
		for (let j = 0; j < matrix2.length; j++) {
			const dot = dotProduct(matrix1[i], matrix2[j]);
			const mag1 = magnitude(matrix1[i]);
			const mag2 = magnitude(matrix2[j]);
			similarity[i].push(dot / (mag1 * mag2));
		}
	}
	return similarity;
}

// Hàm normalize Y_data
function normalize_Y(Y_data) {
	if (!Array.isArray(Y_data)) {
		throw new Error('Y_data must be an array');
	}
	if (Y_data.length === 0) {
		return { Ybar_data: [], mu: [] };
	}

	const n_users = Math.max(...Y_data.map((row) => row[0])) + 1;
	const Ybar_data = [...Y_data];
	const mu = new Array(n_users).fill(0);

	for (let n = 0; n < n_users; n++) {
		const ids = Y_data.reduce((acc, row, index) => {
			if (row[0] === n) acc.push(index);
			return acc;
		}, []);
		const ratings = ids.map((id) => Y_data[id][2]);
		const mean =
			ratings.length > 0
				? ratings.reduce((a, b) => a + b, 0) / ratings.length
				: 0;
		mu[n] = mean;

		ids.forEach((id) => {
			Ybar_data[id][2] = Y_data[id][2] - mean;
		});
	}

	return { Ybar_data, mu };
}

// Hàm tạo ma trận thưa (Sparse matrix)
function createSparseMatrix(Ybar_data, n_items, n_users) {
	const matrix = Array.from({ length: n_items }, () =>
		new Array(n_users).fill(0)
	);
	Ybar_data.forEach(([user, item, rating]) => {
		matrix[item][user] = rating;
	});
	return matrix;
}

// Hàm tính độ tương tự
function similarity(Ybar, dist_func = cosineSimilarity) {
	return dist_func(transposeMatrix(Ybar), transposeMatrix(Ybar));
}

// Hàm chuyển vị ma trận
function transposeMatrix(matrix) {
	return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

// Hàm dự đoán xếp hạng
function __pred(u, i, Y_data, S, k, mu, Ybar, normalized = 1) {
	const ids = Y_data.reduce((acc, row, index) => {
		if (row[1] === i) acc.push(index);
		return acc;
	}, []);
	const users_rated_i = ids.map((id) => Y_data[id][0]);
	const sim = users_rated_i.map((userId) => S[u][userId]);

	const a = sim
		.map((value, index) => ({ value, index }))
		.sort((a, b) => b.value - a.value)
		.slice(0, k)
		.map((obj) => obj.index);

	const nearest_s = a.map((index) => sim[index]);
	const r = a.map((index) => Ybar[i][users_rated_i[index]]);

	const numerator = r.reduce(
		(sum, rating, index) => sum + rating * nearest_s[index],
		0
	);
	const denominator =
		nearest_s.reduce((sum, value) => sum + Math.abs(value), 0) + 1e-8;

	return numerator / denominator + (normalized ? 0 : mu[u]);
}

function mapObjectIDs(Y_data) {
	const userMap = new Map();
	const itemMap = new Map();
	let userIndex = 0;
	let itemIndex = 0;

	const mappedY_data = Y_data.map(([userId, itemId, rating]) => {
		// Map user ObjectID to index
		if (!userMap.has(userId.toString())) {
			userMap.set(userId.toString(), userIndex++);
		}
		// Map item ObjectID to index
		if (!itemMap.has(itemId.toString())) {
			itemMap.set(itemId.toString(), itemIndex++);
		}
		return [
			userMap.get(userId.toString()),
			itemMap.get(itemId.toString()),
			rating,
		];
	});

	return { mappedY_data, userMap, itemMap };
}

const recommend = asyncHandler(async (req, res) => {
	let k = 2;
	let user = req.account._id;
	let accountServices = await AccountService.find({});
	let Y_data = accountServices.map((accService) => {
		return [
			accService.accountId, // userId
			accService.serviceId, // itemId
			accService.rating, // rating
		];
	});

	if (!Array.isArray(Y_data) || Y_data.some((row) => row.length < 3)) {
		return res
			.status(400)
			.json({ status: 'error', message: 'Invalid Y_data format' });
	}

	const { mappedY_data, userMap, itemMap } = mapObjectIDs(Y_data);

	const userIndex = userMap.get(user.toString());
	if (userIndex === undefined) {
		return res.status(404).json({ message: 'User not found' });
	}

	const { Ybar_data, mu } = normalize_Y(mappedY_data);

	const n_items = Math.max(...mappedY_data.map((row) => row[1])) + 1;
	const n_users = Math.max(...mappedY_data.map((row) => row[0])) + 1;

	const Ybar = createSparseMatrix(Ybar_data, n_items, n_users);

	const S = similarity(Ybar);

	const items_rated_by_u = mappedY_data
		.filter((row) => row[0] === userIndex)
		.map((row) => row[1]);

	const recommended_items = [];
	for (let i = 0; i < n_items; i++) {
		if (!items_rated_by_u.includes(i)) {
			const rating = __pred(userIndex, i, mappedY_data, S, k, mu, Ybar);
			if (rating > 0) {
				recommended_items.push([i, rating]);
			}
		}
	}

	const result = recommended_items
		.sort((a, b) => b[1] - a[1])
		.map(([itemIndex, rating]) => {
			const itemId = Array.from(itemMap.keys()).find(
				(key) => itemMap.get(key) === itemIndex
			);
			return { itemId: itemId, rating };
		});

	res.status(200).json({
		status: 'success',
		data: { result },
	});
});

module.exports = {
	recommend,
};
