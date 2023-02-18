const express = require('express');
const mongoose = require('mongoose');
const logger = require('./middleware/logger')
const error404 = require('./middleware/error404')
const {apiRouter} = require('./routes/apiRouter')
const authRouter = require('./routes/authRouter')
const publicRouter = require('./routes/publicRouter')
const cors = require('cors');
const clientUrl = 'http://localhost:8083';

const session = require('express-session')
const {passport} = require('./passport')

const Book = require('./models/book')
let ObjectId = require('mongodb').ObjectId;

app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.set('view engine', 'ejs')

app.use(cors({origin: '*'}));
app.all('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', clientUrl);
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
});

app.use(session({secret: 'SECRET'}));
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(logger)
app.use('/public', express.static(__dirname + '/public'))
app.use('/api', apiRouter)
app.use('/', publicRouter)
app.use('/auth', authRouter)
app.use(error404)


const PORT = process.env.PORT || 3000
const local_url = 'mongodb://root:example@mongo:27017/library?directConnection=true&authSource=admin&replicaSet=replicaset&retryWrites=true'

io.on('connection', (socket) => {
    const {id} = socket;
    console.log(`Socket connected: ${id}`);

    // работа с комнатами
    const {bookId} = socket.handshake.query;
    console.log(`Socket bookId: ${bookId}`);
    socket.join(bookId);
    socket.on('message-to-room', async (msg) => {
        console.log('msg ', msg)
        // Сохраняем комментарий
        let o_id = new ObjectId(bookId);
        await Book.updateOne(
            {"_id": o_id},
            {
                $push:
                    {
                        "comments": {
                            username: msg.username,
                            text: msg.text,
                            commentTime: msg.commentTime
                        }
                    },
            }
        )
        msg.type = `room: ${bookId}`;
        socket.to(bookId).emit('message-to-room', msg);
        socket.emit('message-to-room', msg);
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${id}`);
    });
});

;(async () => {
    try {
        await mongoose.connect(local_url)
            .then(() => console.log("Database connected!"))
            .catch(err => console.log(err));

        server.listen(PORT)
    } catch (e) {
        console.log(e)
    }
})()

module.exports = app;