const express = require('express');
const router = express.Router();

const Todo = require('../../models/todo');

router.get('/', async (req, res) => {
  try {
    const todo = await Todo.find().select('-__v');
    res.json(todo);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id).select('-__v');
    res.json(todo);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  const { title, description } = req.body;
  const newTodo = new Todo({ title, description });

  try {
    await newTodo.save();
    res.json(newTodo);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    await Todo.findByIdAndUpdate(id, { title, description });
    res.redirect(`/api/todo/${id}`);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Todo.deleteOne({ _id: id });
    res.json(true);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
