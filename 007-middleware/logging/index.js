const express = require('express')

const logger = require('./middleware/logger')
const err404 = require('./middleware/err404')
const indexRouter = require('./routes/index')
const demoRouter = require('./routes/demo')

const app = express()

app.use(logger)

app.use('/public', express.static(__dirname + '/public'))
app.use('/', indexRouter)
app.use('/demo', demoRouter)

app.use(err404)

const PORT = process.env.PORT || 3000;
app.listen(PORT)