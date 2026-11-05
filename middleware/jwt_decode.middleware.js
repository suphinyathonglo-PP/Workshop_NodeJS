const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const authorization = req.get('Authorization');
  const match = authorization && authorization.match(/^Bearer\s+(\S+)$/i);
  if (!match) {
    return res.status(401).send({ status: 401, message: 'Bearer token is required.', data: null });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).send({ status: 500, message: 'Authentication is not configured.', data: null });
  }

  try {
    const decoded = jwt.verify(match[1], process.env.JWT_SECRET);
    if (
      typeof decoded !== 'object' ||
      typeof decoded.sub !== 'string' ||
      !['admin', 'shop'].includes(decoded.role)
    ) {
      return res.status(401).send({ status: 401, message: 'Invalid token.', data: null });
    }

    req.user = decoded;
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).send({ status: 401, message: 'Invalid or expired token.', data: null });
    }
    return next(err);
  }

  next();
};