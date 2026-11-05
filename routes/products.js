var express = require("express");
var router = express.Router();
var jwtDecodeMiddleware = require("../middleware/jwt_decode.middleware");
const Product = require("../models/product.model");
const Order = require("../models/order.model");

router.use(jwtDecodeMiddleware);

// ดูสินค้าทั้งหมด
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).send({ status: 200, message: "Success", data: products });
  } catch (error) {
    res
      .status(500)
      .send({
        status: 500,
        message: error.message,
        data: null
      });
  }
});

// ดูสินค้าตาม id
router.get("/:id", async (req, res, next) => {
  try {
    let productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(400)
        .send({ status: 400, message: "ไม่พบสินค้า", data: null });
    }

    res.status(200).send({ status: 200, message: "Success", data: product });
  } catch (error) {
    res
      .status(500)
      .send({
        status: 500,
        message: error.message,
        data: null
      });
  }
});

// ดูออเดอร์ทั้งหมดของสินค้า
router.get("/:id/orders", async (req, res, next) => {
  try {
    let productId = req.params.id;

    const order = await Order.find({ product: productId });
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(400)
        .send({ status: 400, message: "ไม่พบสินค้า", data: null });
    }

    res
      .status(200)
      .send({ status: 200, message: "Success", data: order });
  } catch (error) {
    res
      .status(500)
      .send({
        status: 500,
        message: error.message,
        data: null
      });
  }
});

// เพิ่มสินค้า
router.post("/", jwtDecodeMiddleware, async (req, res, next) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || !description || !price || !stock) {
      return res
        .status(400)
        .send({ status: 400, message: "ข้อมูลไม่ครบ", data: null });
    }

    const product = await new Product({
      name,
      description,
      price,
      stock,
    }).save();

    res.status(201).send({
        status: 201,
        message: "Product added successfully",
        data: product,
      });
  } catch (error) {
    res
      .status(500)
      .send({
        status: 500,
        message: error.message,
        data: null
      });
  }
});

// เพิ่มออเดอร์สำหรับสินค้า
router.post("/:id/orders", jwtDecodeMiddleware, async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.id;

    if (!quantity) {
      return res
        .status(400)
        .send({ status: 400, message: "ไม่ระบุจำนวนสินค้า", data: null });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(400)
        .send({ status: 400, message: "ไม่พบสินค้า", data: null });
    }
    if (quantity > product.stock) {
      return res
        .status(400)
        .send({ status: 400, message: "จำนวนสินค้าไม่เพียงพอ", data: null });
    }

    product.stock -= quantity;
    await product.save();
    const order = await new Order({
      product: productId,
      quantity,
      totalPrice: product.price * quantity,
    }).save();

    res.status(201).send({
        status: 201,
        message: "Order created successfully",
        data: order,
      });
  } catch (error) {
    res
      .status(500)
      .send({
        status: 500,
        message: error.message,
        data: null
      });
  }
});

// แก้ไขสินค้า
router.put("/:id", jwtDecodeMiddleware, async (req, res, next) => {
  try {
    const { name, description, price, stock } = req.body;
    const productId = req.params.id;

    const product = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        price,
        stock,
      },
      { new: true },
    );

    if (!product) {
      return res
        .status(400)
        .send({ status: 400, message: "ไม่พบสินค้า", data: null });
    }

    res
      .status(200)
      .send({
        status: 200,
        message: "Product updated successfully",
        data: product,
      });
  } catch (error) {
    res
      .status(500)
      .send({
        status: 500,
        message: error.message,
        data: null
      });
  }
});

// ลบสินค้า
router.delete("/:id", jwtDecodeMiddleware, async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res
        .status(400)
        .send({ status: 400, message: "ไม่พบสินค้า", data: null });
    }

    res
      .status(200)
      .send({
        status: 200,
        message: "Product deleted successfully",
        data: product,
      });
  } catch (error) {
    res
      .status(500)
      .send({
        status: 500,
        message: error.message,
        data: null
      });
  }
});

module.exports = router;
