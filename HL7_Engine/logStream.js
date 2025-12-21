// engine/logStream.js

// In-memory log buffer
export const logs = [];

// Maximum number of logs to keep (prevents memory bloat)
const MAX_LOGS = 5000;

/**
 * Push a log entry into the global log buffer.
 * Automatically timestamps and trims the buffer.
 */
export function log(message) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${message}`;

  logs.push(entry);

  // Trim old logs if buffer grows too large
  if (logs.length > MAX_LOGS) {
    logs.splice(0, logs.length - MAX_LOGS);
  }
}
