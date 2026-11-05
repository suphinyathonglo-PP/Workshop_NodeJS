var express = require('express');
var router = express.Router();
var jwtDecodeMiddleware = require('../middleware/jwt_decode.middleware');

const Order = require('../models/order.model');

router.use(jwtDecodeMiddleware);

// ดูออเดอร์ทั้งหมด
router.get('/', async (req, res, next) => {
  try {
    const orders = await Order.find().populate('product');

    res.status(200).send({ status: 200, message: "Success", data: orders });
  } catch (error) {
    res.status(500).send({ status: 500, message: error.message, data: null });
  }
});

module.exports = router;
