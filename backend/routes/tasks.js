const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// @route  GET /api/tasks
// @desc   Get all tasks for current user
// @access Private
router.get('/', async (req, res, next) => {
  try {
    const { status, priority, search, sort = '-createdAt' } = req.query;

    const filter = { user: req.user._id };

    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(filter).sort(sort);

    // Stats
    const stats = {
      total: await Task.countDocuments({ user: req.user._id }),
      todo: await Task.countDocuments({ user: req.user._id, status: 'todo' }),
      inProgress: await Task.countDocuments({ user: req.user._id, status: 'in-progress' }),
      completed: await Task.countDocuments({ user: req.user._id, status: 'completed' }),
    };

    res.json({ success: true, count: tasks.length, stats, tasks });
  } catch (error) {
    next(error);
  }
});

// @route  GET /api/tasks/:id
// @desc   Get a single task
// @access Private
router.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
});

// @route  POST /api/tasks
// @desc   Create a new task
// @access Private
router.post(
  '/',
  [body('title').trim().notEmpty().withMessage('Task title is required')],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    try {
      const { title, description, status, priority, dueDate, tags } = req.body;

      const task = await Task.create({
        title,
        description,
        status,
        priority,
        dueDate,
        tags,
        user: req.user._id,
      });

      res.status(201).json({ success: true, task });
    } catch (error) {
      next(error);
    }
  }
);

// @route  PUT /api/tasks/:id
// @desc   Update a task
// @access Private
router.put('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const { title, description, status, priority, dueDate, tags } = req.body;

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate, tags },
      { new: true, runValidators: true }
    );

    res.json({ success: true, task: updated });
  } catch (error) {
    next(error);
  }
});

// @route  PATCH /api/tasks/:id/status
// @desc   Update task status only
// @access Private
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['todo', 'in-progress', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
});

// @route  DELETE /api/tasks/:id
// @desc   Delete a task
// @access Private
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// @route  DELETE /api/tasks
// @desc   Delete all completed tasks
// @access Private
router.delete('/', async (req, res, next) => {
  try {
    const result = await Task.deleteMany({ user: req.user._id, status: 'completed' });
    res.json({ success: true, message: `${result.deletedCount} completed tasks deleted` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
