const express = require('express');
const {testController} = require('../controllers/user.controller');

const router = express.Router();

router.get('/test',testController)

module.exports = router;