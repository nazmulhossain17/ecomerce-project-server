const express = require('express');
const {testController, getUsers} = require('../controllers/user.controller');

const router = express.Router();

router.get('/test',testController)
router.get('/users',getUsers)

module.exports = router;