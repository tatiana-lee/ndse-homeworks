const express = require('express');
const { v4: uuid } = require('uuid');

class Todo {
  constructor(title = '', description = '', id = uuid()) {
    this.title = title;
    this.description = description;
    this.id = id;
  }
}

const storage = {
  todo: [],
};

const app = express();
app.use(express.json());

app.get('/api/todo', (req, res) => {
  const { todo } = storage;
  res.json(todo);
});
app.get('/api/todo/:id', (req, res) => {
  const { todo } = storage;
  const { id } = req.params;
  const i = todo.findIndex((el) => el.id === id);

  if (i !== -1) {
    res.json(todo[i]);
  } else {
    res.status(404);
    res.json('404 | страница не найдена');
  }
});
app.post('/api/todo', (req, res) => {
  const { todo } = storage;
  const { title, description } = req.body;

  const newTodo = new Todo(title, description);
  todo.push(newTodo);

  res.status(201);
  res.json(newTodo);
});
app.put('/api/todo/:id', (req, res) => {
  const { todo } = storage;
  const { title, description } = req.body;
  const { id } = req.params;
  const i = todo.findIndex((el) => el.id === id);

  if (i !== -1) {
    todo[i] = {
      ...todo[i],
      title,
      description,
    };

    res.json(todo[i]);
  } else {
    res.status(404);
    res.json('404 | страница не найдена');
  }
});
app.delete('/api/todo/:id', (req, res) => {
  const { todo } = storage;
  const { id } = req.params;
  const i = todo.findIndex((el) => el.id === id);

  if (i !== -1) {
    todo.splice(i, 1);
    res.json(true);
  } else {
    res.status(404);
    res.json('404 | страница не найдена');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
