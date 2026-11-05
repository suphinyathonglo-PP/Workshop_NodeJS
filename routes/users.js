var express = require('express');
var router = express.Router();
var User = require('../models/users.model');
var jwtDecodeMiddleware = require('../middleware/jwt_decode.middleware');
var requireRole = require('../middleware/role.middleware');

router.put('/:id/approve', jwtDecodeMiddleware, requireRole('admin'), async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(userId, { isApproved: true }, { new: true });
    if (!user) {
      return res.status(400).send({ status: 400, message: "ไม่พบผู้ใช้", data: null });
    }

    res.status(200).send({ status: 200, message: `approve successful.`, data: { _id: user._id, name: user.name, email: user.email, role: user.role, isApproved: user.isApproved } });
  } catch (error) {
    res.status(500).send({ status: 500, message: error.message, data: null });
  }
});

module.exports = router;
