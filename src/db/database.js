const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', '..', 'fleetco_helpdesk.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let dbInstance = null;

function getDatabase() {
  if (!dbInstance) {
    dbInstance = new Database(DB_PATH);
    dbInstance.pragma('journal_mode = WAL');
    
    // Execute schema
    const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
    dbInstance.exec(schemaSql);
  }
  return dbInstance;
}

function saveInteraction({ question, answer, confidence, source }) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO interactions (question, answer, confidence, source, timestamp)
    VALUES (?, ?, ?, ?, datetime('now'))
  `);
  const info = stmt.run(question, answer, Number(confidence), source || 'Unknown');
  return {
    id: info.lastInsertRowid,
    question,
    answer,
    confidence: Number(confidence),
    source,
    timestamp: new Date().toISOString()
  };
}

function saveEscalation({ question, reason }) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO escalations (question, reason, timestamp)
    VALUES (?, ?, datetime('now'))
  `);
  const info = stmt.run(question, reason || 'Low confidence auto-escalation');
  return {
    id: info.lastInsertRowid,
    question,
    reason: reason || 'Low confidence auto-escalation',
    timestamp: new Date().toISOString()
  };
}

function getInteractions(limit = 20) {
  const db = getDatabase();
  return db.prepare(`
    SELECT id, question, answer, confidence, source, timestamp 
    FROM interactions 
    ORDER BY id DESC 
    LIMIT ?
  `).all(limit);
}

function getEscalations(limit = 20) {
  const db = getDatabase();
  return db.prepare(`
    SELECT id, question, reason, timestamp 
    FROM escalations 
    ORDER BY id DESC 
    LIMIT ?
  `).all(limit);
}

function getStats() {
  const db = getDatabase();
  const interactionCount = db.prepare('SELECT COUNT(*) as count FROM interactions').get().count;
  const escalationCount = db.prepare('SELECT COUNT(*) as count FROM escalations').get().count;
  const avgConfidence = db.prepare('SELECT AVG(confidence) as avg FROM interactions').get().avg || 0;
  return {
    interactionCount,
    escalationCount,
    avgConfidence: Number(avgConfidence.toFixed(2))
  };
}

module.exports = {
  getDatabase,
  saveInteraction,
  saveEscalation,
  getInteractions,
  getEscalations,
  getStats
};
