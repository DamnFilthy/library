const express = require('express')
const publicRouter = express.Router()
const {store} = require('./apiRouter')
const request = require('request');
const COUNTER_URL = process.env.COUNTER_URL || 'http://counter:3002/'

publicRouter.get('/books', (req, res) => {
    const {books} = store
    res.status(200)
    res.render('book/index', {
        title: 'Books',
        pageTitle: 'Список Книг',
        books
    })
})

publicRouter.get('/books/:id', async (req, res) => {
    const {books} = store
    const {id} = req.params
    const index = books.findIndex(item => item.id === id)

    if (index !== -1) {
        await request.post(
            COUNTER_URL + '/counter/' + id + '/incr',
            function (error) {
                if (error) {
                    res.status(404)
                    res.json({error: error})
                }
            })
        await request.get(COUNTER_URL + '/counter/' + id,
            function (error, response) {
                if (!error) {
                    let jsonBody = JSON.parse(response.body)
                    console.log(response.body)

                    res.status(200)
                    res.render('book/view', {
                        title: books[index].title,
                        pageTitle: books[index].title,
                        book: books[index],
                        counter: jsonBody.counter
                    })
                } else {
                    res.status(404)
                    res.json({error: error})
                }
            }
        )
    } else {
        res.status(404)
        res.json({error: '404 | книга не найдена'})
    }
})

publicRouter.get('/books/:id/update', (req, res) => {
    const {books} = store
    const {id} = req.params
    const index = books.findIndex(item => item.id === id)

    if (index !== -1) {
        res.status(200)
        res.render('book/update', {
            title: books[index].title,
            pageTitle: books[index].title,
            book: books[index]
        })
    } else {
        res.status(404)
        res.json({error: '404 | книга не найдена'})
    }
})

publicRouter.get('/add-book', (req, res) => {
    res.status(200)
    res.render('book/create', {
        title: 'Create Book',
        pageTitle: 'Создать Книгу'
    })
})
module.exports = publicRouter