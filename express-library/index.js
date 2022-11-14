const express = require('express');
const mongoose = require('mongoose');
const logger = require('./middleware/logger')
const error404 = require('./middleware/error404')
const {apiRouter} = require('./routes/apiRouter')
const publicRouter = require('./routes/publicRouter')
const cors = require('cors');
const clientUrl = 'http://localhost:8083';

app = express()
app.set('view engine', 'ejs')

app.use(cors({origin: '*'}));
app.all('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', clientUrl);
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
});

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(logger)
app.use('/public', express.static(__dirname + '/public'))
app.use('/api', apiRouter)
app.use('/site', publicRouter)
app.use(error404)

const PORT = process.env.PORT || 3000
const urlDB = process.env.urlDB
const LOCAL_DB_URL = process.env.LOCAL_DB_URL
const local_url = 'mongodb://root:example@mongo:27017/books?authSource=admin'
const test_url = 'mongodb://root:example@mongo:27017/books/streamhatchet?directConnection=true&authSource=admin&replicaSet=replicaset&retryWrites=true'

const options = {
        user: "admin",
        pass: "pass",
        dbName: 'books'
    }

;(async () => {
    try {
        await mongoose.connect('mongodb://mongo:27017', options)
            .then(() => console.log("Database connected!"))
            .catch(err => console.log(err));
        app.listen(PORT)
    } catch (e) {
        console.log(e)
    }
})()

module.exports = app