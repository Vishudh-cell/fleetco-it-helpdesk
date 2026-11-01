const fs = require('fs');
const path = require('path');
const { generateEmbedding } = require('./embeddings');
const { cosineSimilarity } = require('../utils/vectorMath');
const { logInfo, logWarn } = require('../utils/logger');

const KB_DIR = path.join(__dirname, '..', '..', 'knowledge_base');

let chunkIndex = [];
let initialized = false;

/**
 * Split markdown document into logical chunks based on headers and paragraphs
 */
function chunkDocument(fileName, rawContent) {
  const lines = rawContent.split('\n');
  const chunks = [];
  
  let docTitle = fileName.replace('.md', '').replace(/_/g, ' ');
  let currentHeader = 'Overview';
  let currentLines = [];

  // Detect main title
  for (const line of lines) {
    if (line.startsWith('# ')) {
      docTitle = line.replace('# ', '').trim();
      break;
    }
  }

  function flushChunk() {
    const text = currentLines.join('\n').trim();
    // Exclude empty chunks or chunks that just repeat the document title
    if (text.length > 50 && text !== docTitle) {
      chunks.push({
        id: `${fileName}#${chunks.length + 1}`,
        fileName,
        docName: docTitle,
        section: currentHeader,
        content: text
      });
    }
    currentLines = [];
  }

  for (const line of lines) {
    // If it's the main H1 title, don't include it as raw body text
    if (line.startsWith('# ')) {
      continue;
    }
    if (line.startsWith('## ') || line.startsWith('### ')) {
      flushChunk();
      currentHeader = line.replace(/^#{2,3}\s+/, '').trim();
    } else {
      currentLines.push(line);
    }
  }
  flushChunk();

  return chunks;
}

/**
 * Initialize knowledge base index and compute embeddings for all chunks
 */
function initRetrievalIndex() {
  if (!fs.existsSync(KB_DIR)) {
    logWarn(`Knowledge base directory not found at: ${KB_DIR}`);
    return [];
  }

  const files = fs.readdirSync(KB_DIR).filter(f => f.endsWith('.md'));
  const allChunks = [];

  for (const file of files) {
    const filePath = path.join(KB_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const chunks = chunkDocument(file, content);
    allChunks.push(...chunks);
  }

  // Pre-calculate vector embeddings for each chunk
  chunkIndex = allChunks.map(chunk => {
    // Rich representation including doc title, section header, and content
    const indexableText = `${chunk.docName} ${chunk.section} ${chunk.content}`;
    const embedding = generateEmbedding(indexableText);
    return {
      ...chunk,
      embedding
    };
  });

  initialized = true;
  logInfo(`Indexed ${chunkIndex.length} knowledge base chunks from ${files.length} documents.`);
  return chunkIndex;
}

/**
 * Retrieve the most relevant document chunks for a given user query
 * @param {string} query 
 * @param {number} topK 
 * @returns {Array<{ chunk: object, similarity: number, score: number }>}
 */
function retrieveChunks(query, topK = 3) {
  if (!initialized || chunkIndex.length === 0) {
    initRetrievalIndex();
  }

  if (!query || typeof query !== 'string' || !query.trim()) {
    return [];
  }

  const queryEmbedding = generateEmbedding(query);
  const queryTokens = new Set(
    query.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 2)
  );

  const scoredChunks = chunkIndex.map(chunk => {
    // 1. Vector cosine similarity
    const vecSimilarity = cosineSimilarity(queryEmbedding, chunk.embedding);

    // 2. Exact keyword matching bonus
    const chunkWords = chunk.content.toLowerCase().split(/\W+/);
    let matchedKeywords = 0;
    queryTokens.forEach(t => {
      if (chunkWords.includes(t)) matchedKeywords++;
    });
    const keywordOverlap = queryTokens.size > 0 ? (matchedKeywords / queryTokens.size) : 0;

    // 3. Section/Title match bonus
    let headerBonus = 0;
    queryTokens.forEach(t => {
      if (chunk.section.toLowerCase().includes(t)) headerBonus += 0.15;
      if (chunk.docName.toLowerCase().includes(t)) headerBonus += 0.10;
    });

    // Calibrated score
    let score = (vecSimilarity * 0.60) + (keywordOverlap * 0.25) + Math.min(0.20, headerBonus);
    score = Math.min(0.99, Number(score.toFixed(4)));

    return {
      chunk: {
        id: chunk.id,
        fileName: chunk.fileName,
        docName: chunk.docName,
        section: chunk.section,
        content: chunk.content
      },
      similarity: Number(vecSimilarity.toFixed(4)),
      score
    };
  });

  // Sort descending by score
  scoredChunks.sort((a, b) => b.score - a.score);

  return scoredChunks.slice(0, topK);
}

function getAllDocuments() {
  if (!initialized) initRetrievalIndex();
  const docsMap = {};
  for (const item of chunkIndex) {
    if (!docsMap[item.fileName]) {
      docsMap[item.fileName] = {
        fileName: item.fileName,
        title: item.docName,
        sections: []
      };
    }
    docsMap[item.fileName].sections.push({
      section: item.section,
      preview: item.content.slice(0, 160) + (item.content.length > 160 ? '...' : '')
    });
  }
  return Object.values(docsMap);
}

module.exports = {
  initRetrievalIndex,
  retrieveChunks,
  getAllDocuments
};
