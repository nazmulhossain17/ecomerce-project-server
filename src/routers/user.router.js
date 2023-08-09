const express = require('express');
const {testController, getUsers, findUserById} = require('../controllers/user.controller');

const router = express.Router();

router.get('/test',testController)
router.get('/users',getUsers)
router.get('/:id', findUserById)

module.exports = router;