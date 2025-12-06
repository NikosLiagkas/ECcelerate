

function buildErrorLog(req, statusCode, errorMessage, debugInfo) {

  const now = new Date();

  return {
    call: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    timeref: now.toISOString(),
    originator: req.ip,
    return_code: statusCode,
    error: errorMessage,
    debuginfo: debugInfo || ""
  };

}

module.exports = { buildErrorLog };