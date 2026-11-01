/**
 * Vector mathematical operations for embedding similarity calculations
 */

function dotProduct(a, b) {
  let sum = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

function magnitude(vec) {
  let sum = 0;
  for (let i = 0; i < vec.length; i++) {
    sum += vec[i] * vec[i];
  }
  return Math.sqrt(sum);
}

function cosineSimilarity(a, b) {
  if (!a || !b || a.length === 0 || b.length === 0) return 0;
  const magA = magnitude(a);
  const magB = magnitude(b);
  if (magA === 0 || magB === 0) return 0;
  const sim = dotProduct(a, b) / (magA * magB);
  // Ensure bounded between 0 and 1 for positive embeddings
  return Math.max(0, Math.min(1, sim));
}

function normalize(vec) {
  const mag = magnitude(vec);
  if (mag === 0) return vec;
  return vec.map(val => val / mag);
}

module.exports = {
  dotProduct,
  magnitude,
  cosineSimilarity,
  normalize
};
