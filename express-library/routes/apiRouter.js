const express = require('express')
const apiRouter = express.Router()
const {v4: uuid} = require('uuid');
const fileMolter = require('../middleware/file.js')
const fs = require('fs')
const path = require('path')

class Book {
    constructor(
        title = '',
        description = '',
        authors = '',
        favorite = '',
        fileCover = '',
        fileName = '',
        fileBook = '',
        id = uuid()
    ) {
        this.id = id
        this.title = title
        this.description = description
        this.authors = authors
        this.favorite = favorite
        this.fileName = fileName
        this.fileCover = fileCover
        this.fileBook = fileBook
    }
}

const store = {
    books: [
        {
            id: "1",
            title: "Сказать жизни «Да!»: психолог в концлагере",
            description: "Эта удивительная книга сделала ее автора одним из величайших духовных учителей человечества в XX веке. В ней философ и психолог Виктор Франкл, прошедший нацистские лагеря смерти, открыл миллионам людей всего мира путь постижения смысла жизни.",
            authors: "Виктор Франкл",
            favorite: "Биографии и мемуары, Зарубежная публицистика",
            fileCover: "Хит продаж",
            fileName: "test.png",
            fileBook: '/public/books/test.png'
        },
        {
            id: "2",
            title: "Will",
            description: "Чему может научить нас простой парень, ставший самым высокооплачиваемым актером Голливуда",
            authors: "Уилл Смитб Марк Мэнсон",
            favorite: "second favorite",
            fileCover: "second fileCover",
            fileName: "test.png",
            fileBook: '/public/books/test.png'
        },
        {
            id: "3",
            title: "Тонкое искусство пофигизма.",
            description: "необходимо научиться искусству пофигизма. Определив то, до чего вам действительно есть дело, нужно уметь наплевать на все второстепенное, забить на трудности",
            authors: "Марк Мэнсон",
            favorite: " Зарубежная психология, Саморазвитие / личностный рост, Социальная психология",
            fileCover: " Бестселлеры «New York Times», Борьба со стрессом, Поиск предназначения, Самореализация",
            fileName: "test.png",
            fileBook: '/public/books/test.png'
        },
    ]
}

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

apiRouter.get('/books', (req, res) => {
    const {books} = store
    res.status(200)
    res.json(books)
})

apiRouter.get('/books/:id', (req, res) => {
    const {books} = store
    const {id} = req.params
    const index = books.findIndex(item => item.id === id)

    if (index !== -1) {
        res.status(200)
        res.json(books[index])
    } else {
        res.status(404)
        res.json({error: '404 | книга не найдена'})
    }
})

apiRouter.get('/books/:id/download', (req, res) => {
    const {books} = store
    const {id} = req.params
    const index = books.findIndex(item => item.id == id)

    if (index !== -1) {
        res.status(200)
        res.download(path.join(process.cwd(), books[index].fileBook), books[index].fileName)
    } else {
        res.status(404)
        res.json({error: '404 | книга не найдена'})
    }
})

apiRouter.post('/books', fileMolter.single('fileBook'),
    (req, res) => {
        const {books} = store
        const {title, description, authors, favorite, fileCover, client} = req.body

        if (!title || title === '') {
            res.sendStatus(404)
            return
        }

        const fileBook = '/public/books/' + req.file.filename
        const fileName = req.file.filename
        const newBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook)

        books.push(newBook)

        if (!client) {
            res.status(201)
            res.json(newBook)
        } else {
            res.status(201)
            res.redirect('/site/books')
        }
    })

apiRouter.put('/books/:id', fileMolter.single('fileBook'),
    (req, res) => {
        const {books} = store
        const {title, description, authors, favorite, fileName, fileCover, client} = req.body
        const {id} = req.params

        if (req.file) {
            var fileBook = '/public/books/' + req.file.filename
        }

        if (!title || title === '') {
            res.sendStatus(400)
            return
        }
        const index = books.findIndex(item => item.id == id)

        if (client && index !== -1) {
            books[index] = {
                ...books[index],
                title,
                description,
                authors,
                favorite,
                fileName,
                fileCover,
                fileBook
            }
            res.status(204)
            res.redirect('/site/books')
        }else if(!client && index !== -1) {
            books[index] = {
                ...books[index],
                title,
                description,
                authors,
                favorite,
                fileName,
                fileCover,
                fileBook
            }
            res.status(204)
            res.json(books[index])
        } else {
            res.status(404)
            res.json({error: '404 | запись не найдена'})
        }
    })


apiRouter.post('/books/:id/update', fileMolter.single('fileBook'),
    (req, res) => {
        const {books} = store
        const {title} = req.body
        const {id} = req.params

        if (!title || title === '') {
            res.sendStatus(400)
            return
        }

        const index = books.findIndex(item => item.id == id)

        if (req.file) {
            let fileBook = '/public/books/' + req.file.filename

            if (index !== -1) {
                books[index] = {
                    ...books[index],
                    ...req.body,
                    fileBook
                }
                res.status(204)
                res.redirect('/site/books')
            } else {
                res.status(404)
                res.json({error: '404 | запись не найдена'})
            }
        } else {
            if (index !== -1) {
                books[index] = {
                    ...books[index],
                    ...req.body
                }
                res.status(204)
                res.redirect('/site/books')
            } else {
                res.status(404)
                res.json({error: '404 | запись не найдена'})
            }
        }
    })

apiRouter.patch('/books/:id', fileMolter.single('fileBook'),
    (req, res) => {
        const {books} = store
        const {title} = req.body
        const {id} = req.params

        if (!title || title === '') {
            res.sendStatus(400)
            return
        }

        const index = books.findIndex(item => item.id == id)

        if (req.file) {
            let fileBook = '/public/books/' + req.file.filename

            if (index !== -1) {
                books[index] = {
                    ...books[index],
                    ...req.body,
                    fileBook
                }
                res.status(204)
                res.json(books[index])
            } else {
                res.status(404)
                res.json({error: '404 | запись не найдена'})
            }
        } else {
            if (index !== -1) {
                books[index] = {
                    ...books[index],
                    ...req.body
                }
                res.status(204)
                res.json(books[index])
            } else {
                res.status(404)
                res.json({error: '404 | запись не найдена'})
            }
        }
    })

apiRouter.delete('/books/:id', (req, res) => {
    const {books} = store
    const {id} = req.params

    const index = books.findIndex(item => item.id == id)

    if (index !== -1) {
        try {
            const rootDir = require('path').resolve('./')
            fs.unlinkSync(rootDir + books[index].fileBook)
        } catch (error) {
            fs.appendFile('server.logs', `FILE ${books[index].fileBook} ERROR TO DELETE: ${error}`,
                (err) => {
                    if (err) throw err;
                })
        }
        books.splice(books[index], 1)
        res.status(201)
        res.json({success: 'Запись была успешна удалена.'})
    } else {
        res.status(404)
        res.json({error: '404 | запись не найдена'})
    }
})

apiRouter.delete('/__test__/data', (req, res) => {
    store.books = []
    res.sendStatus(204)
})

module.exports = {apiRouter, store}