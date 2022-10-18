const express = require('express');
const errorMiddleware = require('./middleware/error');
const indexRouter = require('./routes/index.js');

const app = express();

app.use('/:id/download', express.static(__dirname + '/public'))
app.use('/api/books', indexRouter);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
