# 🛡️ FleetCo IT Helpdesk Bot

A full-stack, enterprise-grade IT Helpdesk AI Assistant built for the **FleetCo** hackathon. The bot grounds responses in company IT documentation using **vector embeddings** and the **TinyFish** retrieval/agent layer. When response confidence drops below **75% (`< 0.75`)**, issues are automatically flagged and escalated to human support specialists, with full interaction and escalation audit logs persisted to **SQLite**.

---

## 🏗️ Architecture & Tech Stack

```
+-------------------------------------------------------------+
|                   React Frontend (Vite)                     |
|  - Modern Dark Theme (Chat UI, Glassmorphic Accents)        |
|  - Real-time Confidence Badge (>=75% Green, <75% Amber/Red) |
|  - Citation Cards with Collapsible Retrieval Chunks         |
|  - Knowledge Base & SQLite Audit Drawer                     |
+-------------------------------------------------------------+
                              │
                    REST APIs (HTTP / JSON)
                              │
+-------------------------------------------------------------+
|                 Node.js + Express Backend                   |
|  - POST /ask       : Vector search + TinyFish synthesis     |
|  - POST /escalate  : Human support ticket creation          |
|  - GET  /health    : System uptime & SQLite metrics         |
|  - GET  /interactions, /escalations, /kb                    |
+-------------------------------------------------------------+
          │                                      │
          ▼                                      ▼
+-----------------------+            +------------------------+
|   TinyFish Agent &    |            |   SQLite Database      |
|   Vector Retrieval    |            |   (better-sqlite3)     |
| - 384-dim Embeddings  |            | - interactions table   |
| - Cosine Similarity   |            | - escalations table    |
| - Grounded Citations  |            | - WAL mode enabled     |
+-----------------------+            +------------------------+
```

### Stack Components
- **Frontend**: React 18, Vite, Lucide Icons, Modern Cyber Dark CSS
- **Backend**: Node.js v24, Express, CORS, Dotenv
- **Database**: SQLite via `better-sqlite3` (`fleetco_helpdesk.db`)
- **Agent / Retrieval Layer**: `TinyFish` grounded synthesis agent with 384-dimensional dense semantic embeddings and cosine similarity search

---

## 📁 Project Structure

```
fleetco-it-helpdesk/
├── data/
│   └── knowledge_base/               # 5 Official IT Documentation Guides
│       ├── vpn_reset_guide.md
│       ├── password_reset_guide.md
│       ├── email_setup_guide.md
│       ├── laptop_troubleshooting_guide.md
│       └── slack_access_guide.md
├── src/
│   ├── db/
│   │   ├── schema.sql                # SQLite schema (interactions, escalations)
│   │   └── database.js               # DB connection & query helpers
│   ├── services/
│   │   ├── embeddings.js             # 384-dimensional dense vector embeddings
│   │   ├── retrieval.js              # Section chunking & cosine similarity search
│   │   └── tinyfish.js               # TinyFish core grounded agent & confidence engine
│   ├── routes/
│   │   └── helpdesk.js               # REST APIs (/ask, /escalate, /health, /kb)
│   ├── utils/
│   │   ├── vectorMath.js             # Cosine similarity, dot product, normalization
│   │   └── logger.js                 # Structured logger
│   └── server.js                     # Express server & static asset serving
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatMessage.jsx       # Chat bubble with markdown & escalation banner
│   │   │   ├── ConfidenceBadge.jsx   # Visual confidence score pill
│   │   │   ├── CitationCard.jsx      # Expandable source citation card
│   │   │   ├── EscalateModal.jsx     # Human support escalation modal
│   │   │   └── KnowledgeDrawer.jsx   # KB browser & SQLite logs inspection drawer
│   │   ├── App.jsx                   # Main chat application state
│   │   ├── App.css                   # Cyber-dark theme styles & animations
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── test_apis.js                      # Automated end-to-end API test script
├── package.json
└── README.md
```

---

## 🚀 Quick Start & Run Instructions

### Prerequisites
- Node.js (v18+) and npm

### 1. Install & Build
Open a terminal in the project directory:
```bash
cd "C:\Users\Dell\.gemini\antigravity\scratch\fleetco-it-helpdesk"

# Install backend dependencies
npm install

# Install frontend dependencies and build production assets
npm --prefix client install
npm --prefix client run build
```

### 2. Start the Server
```bash
npm start
```
The server will boot on **`http://localhost:5000`** and automatically serve the React frontend and all REST endpoints.

### 3. (Optional) Run Frontend in Hot-Reload Dev Mode
If you wish to develop on the React frontend with Vite HMR:
```bash
npm run dev:client
```
The Vite dev server will run on `http://localhost:3000` with automated proxying to the Express backend on port 5000.

---

## 🧪 Running the Verification Test Suite

A standalone test suite is included to verify all required functionality:
```bash
node test_apis.js
```

What the test verifies:
1. `GET /health` responds with HTTP 200 and initial SQLite stats.
2. `POST /ask` with a standard IT question (`"How do I reset my VPN?"`) produces high confidence (`>= 0.75`), grounded answer, and citations without escalation.
3. `POST /ask` with an out-of-domain query (`"Can I bring my pet iguana?"`) produces low confidence (`< 0.75`), flags `needsEscalation: true`, and automatically logs a record to the SQLite `escalations` table.
4. `POST /escalate` accepts human escalation requests with custom notes and returns ticket ID.
5. `GET /interactions` and `GET /escalations` return the persisted SQLite records.

---

## 🔌 API Reference

### 1. `POST /ask`
Ask an IT question to the knowledge base.
- **Request Body**:
  ```json
  {
    "question": "How do I reset my FleetCo VPN connection?"
  }
  ```
- **Response** (Confidence >= 0.75):
  ```json
  {
    "id": 1,
    "question": "How do I reset my FleetCo VPN connection?",
    "answer": "Here are the official instructions from FleetCo IT Knowledge Base: VPN Reset Guide...",
    "confidence": 0.88,
    "source": "FleetCo IT Knowledge Base: VPN Reset Guide (Step-by-Step VPN Reset Procedure)",
    "retrievedChunks": [ ... ],
    "needsEscalation": false,
    "autoEscalated": false,
    "timestamp": "2026-11-01T06:23:50.000Z"
  }
  ```
- **Response** (Confidence < 0.75):
  ```json
  {
    "id": 2,
    "question": "Can I bring my pet iguana?",
    "answer": "I could not locate sufficiently relevant FleetCo IT documentation...",
    "confidence": 0.03,
    "source": "Partial / Unmatched",
    "retrievedChunks": [ ... ],
    "needsEscalation": true,
    "autoEscalated": true,
    "escalationId": 1,
    "timestamp": "2026-11-01T06:23:50.000Z"
  }
  ```

### 2. `POST /escalate`
Manually create an escalation ticket for Tier-2 Human Support.
- **Request Body**:
  ```json
  {
    "question": "MacBook display flickering intermittently",
    "reason": "Hardware check needed"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Escalation ticket successfully registered for FleetCo Human IT Support.",
    "escalation": {
      "id": 2,
      "question": "MacBook display flickering intermittently",
      "reason": "Hardware check needed",
      "timestamp": "2026-11-01T06:23:50.000Z"
    }
  }
  ```

### 3. `GET /health`
System status, version, and SQLite table counts.

---

## 💡 Knowledge Base Content Included
1. **VPN Reset Guide**: Cisco AnyConnect / WireGuard, DNS flushing, Duo MFA push/passcode resync, primary and DR gateways.
2. **Password Reset Guide**: Okta SSO SSPR, 90-day expiry, 14-char complexity rules, account lockout unlock URL.
3. **Email Setup Guide**: Microsoft 365 Exchange Online, Outlook desktop setup, Intune MDM for iOS/Android, legacy IMAP/POP3 prohibition.
4. **Laptop Troubleshooting Guide**: Emergency reset pinhole for ThinkPad, SMC/power reset for MacBook, dock Thunderbolt power-cycling, 80% battery conservation.
5. **Slack Access Guide**: Enterprise Grid SSO join, default channels (`#it-helpdesk`, etc.), cache clearing, private channel request workflows.
