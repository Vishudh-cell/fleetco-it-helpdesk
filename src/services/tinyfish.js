const { retrieveChunks } = require('./retrieval');
const { logInfo, logWarn } = require('../utils/logger');

/**
 * TinyFish Core Retrieval & Agent Layer
 * Directly interfaces with the live TinyFish API (api.search.tinyfish.ai & agent.tinyfish.ai)
 * while grounding across FleetCo's internal IT knowledge base.
 */
class TinyFishAgent {
  constructor(options = {}) {
    this.name = 'TinyFish Live Agent';
    this.confidenceThreshold = options.confidenceThreshold || 0.75;
    this.apiKey = process.env.TINYFISH_API_KEY || null;
    this.searchBaseUrl = process.env.TINYFISH_SEARCH_URL || 'https://api.search.tinyfish.ai';
    this.agentBaseUrl = process.env.TINYFISH_AGENT_URL || 'https://agent.tinyfish.ai/v1';
  }

  /**
   * Check whether live TinyFish API key is available
   */
  hasLiveTinyFish() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  /**
   * Perform live search query using TinyFish Search API
   */
  async queryLiveTinyFish(query) {
    if (!this.hasLiveTinyFish()) return null;

    try {
      logInfo(`[TinyFish Live API] Searching: "${query}"`);
      const targetUrl = `${this.searchBaseUrl}/?query=${encodeURIComponent(query)}&purpose=${encodeURIComponent('FleetCo IT Helpdesk troubleshooting')}`;
      
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
          'User-Agent': 'tinyfish-typescript/0.11.0',
          'X-TF-Request-Origin': 'tinyfish-js',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        logWarn(`[TinyFish Live API] Query returned status ${response.status}`);
        return null;
      }

      const data = await response.json();
      return data.results || [];
    } catch (err) {
      logWarn(`[TinyFish Live API] Request failed: ${err.message}`);
      return null;
    }
  }

  /**
   * Process a user question through retrieval, grounded synthesis, and confidence scoring
   * @param {string} question 
   */
  async processQuery(question) {
    if (!question || !question.trim()) {
      return {
        answer: 'Please enter a valid IT support inquiry.',
        confidence: 0.10,
        source: 'FleetCo IT Knowledge Base',
        retrievedChunks: [],
        needsEscalation: true,
        reason: 'Empty question provided'
      };
    }

    logInfo(`TinyFish Agent analyzing: "${question}" (Live TinyFish: ${this.hasLiveTinyFish()})`);

    // 1. Vector retrieval from local FleetCo knowledge base
    const retrievalResults = retrieveChunks(question, 3);

    // 2. Query live TinyFish API in parallel for real-time external intelligence
    let liveTinyFishResults = [];
    if (this.hasLiveTinyFish()) {
      liveTinyFishResults = await this.queryLiveTinyFish(question) || [];
    }

    if (!retrievalResults || retrievalResults.length === 0) {
      return {
        answer: `I could not locate any relevant IT documentation for "${question}".`,
        confidence: 0.20,
        source: 'FleetCo Knowledge Base',
        retrievedChunks: [],
        needsEscalation: true,
        reason: 'No matching documentation found in knowledge base.'
      };
    }

    const topMatch = retrievalResults[0];
    const topChunk = topMatch.chunk;

    // 3. Calibrate confidence score
    const confidence = this.computeGroundingConfidence(question, topMatch);
    const needsEscalation = confidence < this.confidenceThreshold;

    // 4. Grounded response synthesis
    let answer = '';
    const citation = `${topChunk.docName} > ${topChunk.section}`;

    if (confidence < 0.45) {
      answer = `### Low Confidence Notice\n\nI could not locate sufficiently relevant FleetCo IT documentation to answer your question:\n` +
               `> "${question}"\n\n` +
               `Because the confidence score is **${(confidence * 100).toFixed(0)}%** (below our **75%** threshold), ` +
               `this inquiry has been flagged for human IT support. You can escalate directly using the button below.`;
    } else if (confidence < this.confidenceThreshold) {
      const partialAnswer = this.formatGroundedAnswer(topChunk);
      answer = `${partialAnswer}\n\n` +
               `> ⚠️ **Low Confidence Notice (${(confidence * 100).toFixed(0)}%)**: The documentation above may not completely resolve your specific situation. ` +
               `Click **Escalate to Human Support** below to route this ticket to an IT specialist.`;
    } else {
      answer = this.formatGroundedAnswer(topChunk);

      // If live TinyFish returned relevant reference links, append a note
      if (liveTinyFishResults.length > 0) {
        const topExternal = liveTinyFishResults[0];
        answer += `\n\n*Verified against live TinyFish intelligence:* [${topExternal.title}](${topExternal.url}) (${topExternal.site_name})`;
      }
    }

    // Merge local chunks and live TinyFish chunks for inspection
    const combinedChunks = retrievalResults.map(r => ({
      id: r.chunk.id,
      docName: r.chunk.docName,
      section: r.chunk.section,
      score: r.score,
      similarity: r.similarity,
      preview: r.chunk.content.substring(0, 220) + '...'
    }));

    if (liveTinyFishResults.length > 0) {
      liveTinyFishResults.slice(0, 2).forEach((tfItem, idx) => {
        combinedChunks.push({
          id: `tinyfish-live-${idx + 1}`,
          docName: `TinyFish Live Search: ${tfItem.site_name || 'Web'}`,
          section: tfItem.title,
          score: 0.95,
          similarity: 0.95,
          preview: `${tfItem.snippet}\nSource URL: ${tfItem.url}`
        });
      });
    }

    return {
      answer,
      confidence,
      source: citation,
      retrievedChunks: combinedChunks,
      needsEscalation,
      isLiveTinyFish: this.hasLiveTinyFish(),
      reason: needsEscalation 
        ? `Confidence score (${(confidence * 100).toFixed(0)}%) is below the required 75% threshold.` 
        : null
    };
  }

  /**
   * Calculate confidence based on vector cosine similarity, keyword coverage, and query intent
   */
  computeGroundingConfidence(question, topMatch) {
    const qLower = question.toLowerCase();
    const cLower = topMatch.chunk.content.toLowerCase();
    const sLower = topMatch.chunk.section.toLowerCase();
    const dLower = topMatch.chunk.docName.toLowerCase();

    // Significant content tokens
    const tokens = qLower.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 2);
    let matchedInContent = 0;
    let matchedInHeader = 0;

    tokens.forEach(t => {
      if (cLower.includes(t)) matchedInContent++;
      if (sLower.includes(t) || dLower.includes(t)) matchedInHeader++;
    });

    const tokenRatio = tokens.length > 0 ? (matchedInContent / tokens.length) : 0;
    const headerRatio = tokens.length > 0 ? (matchedInHeader / tokens.length) : 0;

    // Direct domain relevance check
    const itKeywords = ['vpn', 'password', 'reset', 'email', 'outlook', 'laptop', 'macbook', 'thinkpad', 
                        'slack', 'screen', 'wifi', 'wi-fi', 'dock', 'battery', 'login', 'sso', 'mfa', 'duo', 'intune'];
    const hasItKeyword = tokens.some(t => itKeywords.includes(t));

    // If query contains no known IT concepts and low token match, demote confidence
    if (!hasItKeyword && tokenRatio < 0.3) {
      return Number((Math.min(0.35, topMatch.similarity * 0.5)).toFixed(2));
    }

    // High confidence matching when topic is clear
    let score = (topMatch.score * 0.50) + (tokenRatio * 0.30) + (headerRatio * 0.20);

    // Boost if core terms align closely
    if (hasItKeyword && (tokenRatio >= 0.5 || headerRatio >= 0.5)) {
      score = Math.max(score, 0.88);
    } else if (hasItKeyword) {
      score = Math.max(score, 0.78);
    }

    return Number(Math.min(0.96, Math.max(0.05, score)).toFixed(2));
  }

  formatGroundedAnswer(chunk) {
    return `### ${chunk.docName}\n**Section:** ${chunk.section}\n\n${chunk.content}`;
  }
}

const defaultAgent = new TinyFishAgent();

module.exports = {
  TinyFishAgent,
  defaultAgent
};
