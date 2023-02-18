const express = require('express')
const apiRouter = express.Router()
const fileMolter = require('../middleware/file.js')
const fs = require('fs')
const path = require('path')

const Book = require('../models/book')

let ObjectId = require('mongodb').ObjectId;

const auth = {
    users: [
        {
            id: '1',
            name: 'root',
            role: 'admin',
            mail: 'test@mail.ru'
        }
    ]
}

apiRouter.get('/user/login', (req, res) => {
    const {users} = auth
    const {id} = req.query
    const index = users.findIndex(item => item.id == id)

    if (index !== -1) {
        res.status(200)
        res.json(users[index])
    } else {
        res.status(404)
        res.json({error: '404 | пользователя не существует'})
    }
})

apiRouter.get('/books', async (req, res) => {
    const books = await Book.find({}).select('-__v')

    res.status(200)
    await res.json(books)
})

apiRouter.get('/books/:id', async (req, res) => {
    const {id} = req.params
    let o_id = new ObjectId(id);
    const bookID = await Book.findOne({"_id": o_id})

    if (bookID) {
        res.status(200)
        await res.json(bookID)
    } else {
        res.status(404)
        await res.json({error: '404 | книга не найдена'})
    }
})

apiRouter.get('/books/:id/download', async (req, res) => {
    const {id} = req.params
    let o_id = new ObjectId(id);
    const bookID = await Book.findOne({"_id": o_id})

    if (bookID) {
        res.status(200)
        res.download(path.join(process.cwd(), bookID.fileBook), bookID.fileName)
    } else {
        res.status(404)
        res.json({error: '404 | книга не найдена'})
    }
})

apiRouter.post('/books', fileMolter.single('fileBook'),
    async (req, res) => {
        const {title, description, authors, favorite, fileCover, client} = req.body

        if (!title || title === '') {
            res.sendStatus(404)
            return
        }

        const fileBook = '/public/books/' + req.file.filename
        const fileName = req.file.filename
        new Book({
            title: title,
            description: description,
            authors: authors,
            favorite: favorite,
            fileCover: fileCover,
            fileName: fileName,
            fileBook: fileBook
        }).save().then(r => console.log(r)).catch(e => console.log(e))

        if (!client) {
            res.status(201)
            res.json({message: "Книга Создана"})
        } else {
            res.status(201)
            res.redirect('/books')
        }
    })

apiRouter.put('/books/:id', fileMolter.single('fileBook'),
    async (req, res) => {
        const {title} = req.body
        const {id} = req.params
        let o_id = new ObjectId(id);
        let bookID = await Book.findOne({"_id": o_id})

        if (req.file) {
            var fileBook = '/public/books/' + req.file.filename
        }

        if (!title || title === '') {
            res.status(400)
            res.json({error: 'field title is required'})
            return
        }

        try {
            await Book.updateOne(
                {"_id": o_id},
                {
                    $set:
                        {
                            "title": req.body.title,
                            "description": req.body.description,
                            "authors": req.body.authors,
                            "comments": [],
                            "favorite": req.body.favorite,
                            "fileName": req.body.fileName,
                            "fileCover": req.body.fileCover,
                            "fileBook": fileBook ? fileBook : ''
                        },
                }
            )
            res.status(204)
            res.json(bookID)
        } catch (e) {
            console.log(e)
            res.status(404)
            res.json({error: '404 | запись не найдена'})
        }
    })

apiRouter.post('/books/:id/update', fileMolter.single('fileBook'),
    async (req, res) => {
        const {id} = req.params
        let o_id = new ObjectId(id);

        let fileBook = '/public/books/' + req.file.filename

        try {
            await Book.updateOne(
                {"_id": o_id},
                {
                    $set:
                        {
                            "title": req.body.title,
                            "description": req.body.description,
                            "authors": req.body.authors,
                            "comments": [],
                            "favorite": req.body.favorite,
                            "fileName": req.body.fileName,
                            "fileCover": req.body.fileCover,
                            "fileBook": fileBook
                        },
                }
            )
            res.status(204)
            res.redirect('/books')
        } catch (e) {
            res.status(404)
            res.json({error: e})
        }
    })

apiRouter.delete('/books/:id', async (req, res) => {
    const {id} = req.params
    let o_id = new ObjectId(id);

    let bookID = await Book.findOne({"_id": o_id})

    if (bookID) {
        // Удаление файла на сервере
        try {
            const rootDir = require('path').resolve('./')
            fs.unlinkSync(rootDir + bookID.fileBook)
        } catch (error) {
            fs.appendFile('server.logs', `FILE ${bookID.fileBook} ERROR TO DELETE: ${error}`,
                (err) => {
                    if (err) throw err;
                })
        }
        // Удаление записи в бд
        try {
            await Book.deleteOne({"_id": o_id})
            res.status(201)
            res.json({success: 'Запись была успешна удалена.'})
        } catch (e) {
            res.status(404)
            res.json({error: e})
        }

    } else {
        res.status(404)
        res.json({error: '404 | запись не найдена'})
    }
})

apiRouter.delete('/__test__/data', (req, res) => {
    res.sendStatus(204)
})

module.exports = {apiRouter}