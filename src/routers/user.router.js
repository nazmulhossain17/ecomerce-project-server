const express = require('express');
const {testController, getUsers, findUserById, deleteUser, processRegister} = require('../controllers/user.controller');

const router = express.Router();

router.get('/test',testController)
router.get('/users',getUsers)
router.post('/process-register', processRegister)
router.get('/:id', findUserById)
router.delete('/:id', deleteUser);

module.exports = router;