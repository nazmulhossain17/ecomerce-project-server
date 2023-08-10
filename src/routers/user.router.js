const express = require('express');
const {testController, getUsers, findUserById, deleteUser, processRegister, activateUserAccount} = require('../controllers/user.controller');

const router = express.Router();

router.get('/test',testController)
router.get('/users',getUsers)
router.post('/process-register', processRegister)
router.post('/api/verify', activateUserAccount)
router.get('/:id', findUserById)
router.delete('/:id', deleteUser);

module.exports = router;