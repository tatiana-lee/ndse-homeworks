const { Schema, model } = require('mongoose');

const todoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model('Todo', todoSchema);
