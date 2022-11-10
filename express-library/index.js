const express = require('express');
const logger = require('./middleware/logger')
const error404 = require('./middleware/error404')
const {apiRouter} = require('./routes/apiRouter')
const publicRouter = require('./routes/publicRouter')

app = express()
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(logger)
app.use('/public', express.static(__dirname + '/public'))
app.use('/api', apiRouter)
app.use('/site', publicRouter)
app.use(error404)

const PORT = process.env.PORT || 3000
app.listen(PORT)

module.exports = app