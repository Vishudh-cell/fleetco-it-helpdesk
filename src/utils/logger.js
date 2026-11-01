function logInfo(message, context = {}) {
  const timestamp = new Date().toISOString();
  console.log(`[INFO] [${timestamp}] ${message}`, Object.keys(context).length ? JSON.stringify(context) : '');
}

function logWarn(message, context = {}) {
  const timestamp = new Date().toISOString();
  console.warn(`[WARN] [${timestamp}] ${message}`, Object.keys(context).length ? JSON.stringify(context) : '');
}

function logError(message, error = {}) {
  const timestamp = new Date().toISOString();
  console.error(`[ERROR] [${timestamp}] ${message}`, error);
}

module.exports = {
  logInfo,
  logWarn,
  logError
};
