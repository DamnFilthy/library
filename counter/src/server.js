const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const redis = require('redis')

const PORT = process.env.PORT || 3002
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost'

app.use(bodyParser.urlencoded({extended: false}));


const client = redis.createClient({url: REDIS_URL})

;(async () => {
    await client.connect()
})()

app.get('/counter/:bookId', async (req, res) => {
    const {bookId} = req.params
    const counter = await client.get(bookId)

    await res.json({counter})
})

app.post('/counter/:bookId/incr', async (req, res) => {
    const {bookId} = req.params
    await client.incr(bookId)

    await res.status(200)
})

app.listen(PORT, () => {
    console.log(`server start on ${PORT}...`)
})