const AuditLog = require("../models/AuditLog");

/**
 * Creates an audit log entry.
 * @param {string} userId - ID of the user performing the action.
 * @param {string} action - Action being performed (e.g., 'JOB_POSTED', 'APPLICATION_REJECTED').
 * @param {string} entityType - Type of entity involved ('User', 'Job', etc.).
 * @param {string} [entityId] - ID of the specific entity.
 * @param {object} [details] - Additional details about the action.
 * @param {object} [req] - Optional Express request object to extract IP/UA.
 */
const logAction = async ({ userId, action, entityType, entityId, details, req }) => {
  try {
    const logPost = {
      userId,
      action,
      entityType,
      entityId,
      details,
    };

    if (req) {
      logPost.ipAddress = req.ip || req.headers["x-forwarded-for"] || "unknown";
      logPost.userAgent = req.get("User-Agent") || "unknown";
    }

    await AuditLog.create(logPost);
  } catch (error) {
    // We don't want audit logging failure to crash the application flow,
    // but it should be logged elsewhere (like in console or main error logs).
    console.error("CRITICAL: Failed to create audit log entry", error);
  }
};

module.exports = { logAction };
