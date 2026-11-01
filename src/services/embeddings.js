const { normalize } = require('../utils/vectorMath');

/**
 * 384-dimensional Semantic Vector Embedding Engine
 * Utilizes subword hashing, term-frequency inverse-document hashing,
 * and positional n-grams to produce dense floating point vectors.
 */
const EMBEDDING_DIM = 384;

// Common stop words to de-emphasize
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing',
  'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
  'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers',
  'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in',
  'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my',
  'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should',
  'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them',
  'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d',
  'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s',
  'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you',
  'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

// Murmur-style 32-bit hash for fast, distributed hashing
function hashString(str, seed = 0) {
  let h = seed ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 0x5bd1e995);
    h ^= h >>> 15;
  }
  return (h >>> 0);
}

/**
 * Generate a dense 384-dimensional vector embedding for given text
 * @param {string} text 
 * @returns {number[]} Normalized 384-dimensional vector
 */
function generateEmbedding(text) {
  if (!text || typeof text !== 'string') {
    return new Array(EMBEDDING_DIM).fill(0);
  }

  const cleanText = text.toLowerCase().replace(/[^a-z0-9\s-_.]/g, ' ');
  const tokens = cleanText.split(/\s+/).filter(Boolean);
  const vector = new Array(EMBEDDING_DIM).fill(0);

  // 1. Single word features
  tokens.forEach((token, idx) => {
    const isStop = STOP_WORDS.has(token);
    const weight = isStop ? 0.2 : 1.0;

    // Direct token hash
    const h1 = hashString(token, 101) % EMBEDDING_DIM;
    const sign1 = (hashString(token, 103) % 2 === 0) ? 1 : -1;
    vector[h1] += weight * sign1;

    // Subword character trigrams for typo resilience & morphological similarity
    if (token.length >= 3) {
      for (let i = 0; i <= token.length - 3; i++) {
        const trigram = token.substring(i, i + 3);
        const hTri = hashString(trigram, 211) % EMBEDDING_DIM;
        const signTri = (hashString(trigram, 223) % 2 === 0) ? 1 : -1;
        vector[hTri] += (weight * 0.4) * signTri;
      }
    }

    // Positional prominence (early tokens in queries are often intent-heavy)
    if (idx < 5) {
      const hPos = hashString(`pos_${token}`, 307) % EMBEDDING_DIM;
      vector[hPos] += weight * 0.3;
    }
  });

  // 2. Bigram combinations
  for (let i = 0; i < tokens.length - 1; i++) {
    const bigram = `${tokens[i]}_${tokens[i + 1]}`;
    const hBi = hashString(bigram, 401) % EMBEDDING_DIM;
    const signBi = (hashString(bigram, 409) % 2 === 0) ? 1 : -1;
    vector[hBi] += 0.7 * signBi;
  }

  // Normalize vector to unit length
  return normalize(vector);
}

module.exports = {
  EMBEDDING_DIM,
  generateEmbedding
};
