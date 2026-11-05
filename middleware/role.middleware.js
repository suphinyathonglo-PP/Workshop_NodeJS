module.exports = function(...roles) {
  return function(req, res, next) {
    if (!req.user) {
      return res.status(401).send({ status: 401, message: 'Authentication is required.', data: null });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(401).send({ status: 401, message: 'Insufficient permissions.', data: null });
    }

    next();
  };
};
