var express = require('express');
var router = express.Router();
var User = require('../models/users.model');

var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).send({ status: 400, message: "ข้อมูลไม่ครบ", data: null })
    }

    const exist = await User.findOne({ email })
    if (exist) {
      return res.status(400).send({ status: 400, message: "email นี้ถูกใช้แล้ว", data: null })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await new User({
      name,
      email,
      password: hash,
      role: 'shop',
      isApproved: false
    }).save()

    res.status(201).send({
      status: 201,
      message: "register success",
      data: { _id: user._id, name: user.name, email: user.email, role: user.role, isApproved: user.isApproved }
    })
  } catch (error) {
    res.status(500).send({ status: 500, message: "error", data: null })
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ status: 400, message: 'Email and password are required', data: null });
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ status: 401, message: 'Invalid email or password', data: null });
    }

    if (!user.isApproved) {
      return res.status(401).send({ status: 401, message: 'Account is not approved', data: null });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).send({ status: 500, message: 'Authentication is not configured', data: null });
    }

    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).send({
      status: 200,
      message: 'Login successful',
      data: {token, user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }}
    });
  } catch (error) {
    res.status(500).send({ status: 500, message: 'Error logging in', data: null });
  }
});

module.exports = router;
