const asyncHandler = require("express-async-handler");

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
  
const recommend = asyncHandler(async (req, res) => {
  console.log("RQ:", req.body);

  const { Y_data, user, k } = req.body;

  const { Ybar_data, mu } = normalize_Y(Y_data);

  console.log("NML Y", normalize_Y(Y_data));

  const n_items = Math.max(...Y_data.map((row) => row[1])) + 1;
  const n_users = Math.max(...Y_data.map((row) => row[0])) + 1;

  const Ybar = createSparseMatrix(Ybar_data, n_items, n_users);

  console.log("SpareMatrix: ", createSparseMatrix(Ybar_data, n_items, n_users));

  const S = similarity(Ybar);

  const ids = Y_data.reduce((acc, row, index) => {
    if (row[0] === user) acc.push(index);
    return acc;
  }, []);
  const items_rated_by_u = ids.map((id) => Y_data[id][1]);
  const recommended_items = [];

  for (let i = 0; i < n_items; i++) {
    if (!items_rated_by_u.includes(i)) {
      const rating = __pred(user, i, Y_data, S, k, mu);
      if (rating > 0) {
        recommended_items.push([i, rating]);
      }
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      result: recommended_items.sort((a, b) => b[1] - a[1]),
    },
  });
});

module.exports = {
  recommend,
};
