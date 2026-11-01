const express = require('express');
const router = express.Router();
const { defaultAgent } = require('../services/tinyfish');
const { 
  saveInteraction, 
  saveEscalation, 
  getInteractions, 
  getEscalations, 
  getStats 
} = require('../db/database');
const { getAllDocuments } = require('../services/retrieval');
const { logInfo, logError } = require('../utils/logger');

/**
 * POST /ask
 * User asks an IT support question.
 * Retrieves context via vector embeddings, synthesizes response via TinyFish,
 * evaluates confidence score, logs interaction to SQLite, and automatically
 * logs escalation if confidence < 0.75.
 */
router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'Question parameter is required and cannot be empty.' });
    }

    logInfo(`Incoming /ask request: "${question.trim()}"`);

    // 1. Process query with TinyFish Agent (retrieval + grounding + confidence)
    const agentResponse = await defaultAgent.processQuery(question.trim());

    // 2. Store all interactions in SQLite: question, answer, confidence, source, timestamp
    const interactionRecord = saveInteraction({
      question: question.trim(),
      answer: agentResponse.answer,
      confidence: agentResponse.confidence,
      source: agentResponse.source
    });

    let autoEscalated = false;
    let escalationId = null;

    // 3. If confidence < 0.75: Create escalation record in SQLite
    if (agentResponse.confidence < 0.75) {
      const escalationReason = agentResponse.reason || `Automated escalation: Confidence score (${agentResponse.confidence}) is below threshold 0.75`;
      const escalationRecord = saveEscalation({
        question: question.trim(),
        reason: escalationReason
      });
      autoEscalated = true;
      escalationId = escalationRecord.id;
    }

    return res.status(200).json({
      id: interactionRecord.id,
      question: interactionRecord.question,
      answer: interactionRecord.answer,
      confidence: interactionRecord.confidence,
      source: interactionRecord.source,
      timestamp: interactionRecord.timestamp,
      retrievedChunks: agentResponse.retrievedChunks,
      needsEscalation: agentResponse.needsEscalation,
      autoEscalated,
      escalationId
    });
  } catch (error) {
    logError('Error processing /ask:', error);
    return res.status(500).json({ error: 'Internal server error while processing question.' });
  }
});

/**
 * POST /escalate
 * Manually or programmatically trigger escalation to human IT support.
 */
router.post('/escalate', (req, res) => {
  try {
    const { question, reason } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required to escalate.' });
    }

    const escalationReason = reason || 'User manually requested human IT specialist escalation.';
    const record = saveEscalation({
      question,
      reason: escalationReason
    });

    logInfo(`Ticket escalated to human support: #${record.id} - "${question}"`);

    return res.status(201).json({
      success: true,
      message: 'Escalation ticket successfully registered for FleetCo Human IT Support.',
      escalation: record
    });
  } catch (error) {
    logError('Error in /escalate:', error);
    return res.status(500).json({ error: 'Failed to record escalation.' });
  }
});

/**
 * GET /health
 * Service health check
 */
router.get('/health', (req, res) => {
  try {
    const stats = getStats();
    return res.status(200).json({
      status: 'ok',
      service: 'FleetCo IT Helpdesk Bot',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      stats
    });
  } catch (error) {
    return res.status(200).json({
      status: 'degraded',
      service: 'FleetCo IT Helpdesk Bot',
      error: error.message
    });
  }
});

/**
 * GET /interactions
 * Retrieve recent interactions log
 */
router.get('/interactions', (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 30;
    const records = getInteractions(limit);
    return res.status(200).json({ interactions: records });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch interactions.' });
  }
});

/**
 * GET /escalations
 * Retrieve recent escalations log
 */
router.get('/escalations', (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 30;
    const records = getEscalations(limit);
    return res.status(200).json({ escalations: records });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch escalations.' });
  }
});

/**
 * GET /kb
 * List all knowledge base documentation articles
 */
router.get('/kb', (req, res) => {
  try {
    const docs = getAllDocuments();
    return res.status(200).json({ documents: docs });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve knowledge base.' });
  }
});

module.exports = router;
