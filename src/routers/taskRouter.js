const express = require('express');
const auth = require('../middleware/auth');
const { createTask, getTask, deleteTask, editTask, getAllTasks } = require('../controllers/tasksController');

const router = express.Router();

router.post('/tasks/new', auth, createTask);

router.get('/tasks/get', auth, getTask);

router.delete('/tasks/delete', auth, deleteTask);

router.patch('/tasks/edit', auth, editTask);

router.get('/tasks/all', auth, getAllTasks);

module.exports = router;