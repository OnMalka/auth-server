const express = require('express');
const auth = require('../middleware/auth');
const { createUser, getUser, editUser, deleteUser, login, logout, logoutAllDevices, regenToken } = require('../controllers/userssController');

const router = new express.Router();

router.post('/users/new', createUser);

router.get('/users/get', auth, getUser);

router.patch('/users/edit', auth, editUser);

router.delete('/users/delete', auth, deleteUser);

router.post('/users/login', login);

router.post('/users/logout', auth, logout);

router.post('/users/logout/all', auth, logoutAllDevices);

router.get('/users/regen-token', auth, regenToken);

module.exports = router;