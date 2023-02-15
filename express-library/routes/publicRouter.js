const mongoose = require('mongoose');
const express = require('express')
const publicRouter = express.Router()
const request = require('request');
const COUNTER_URL = process.env.COUNTER_URL || 'http://counter:3002/'

const Book = require('../models/book')

let ObjectId = require('mongodb').ObjectId;

publicRouter.get('/', async (req, res) => {
    try {
        const books = await Book.find({}).select('-__v')
        res.status(200)
        res.render('book/index', {
            title: 'Books',
            pageTitle: 'Список Книг',
            books
        })
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
})

publicRouter.get('/books/:id', async (req, res) => {
    const {id} = req.params
    let o_id = new ObjectId(id);

    const bookID = await Book.findOne({"_id": o_id})

    try {
        if (bookID) {
            await request.post(
                COUNTER_URL + '/counter/' + o_id + '/incr',
                function (error) {
                    if (error) {
                        res.status(404)
                        res.json({error: error})
                    }
                })
            await request.get(COUNTER_URL + '/counter/' + o_id,
                function (error, response) {
                    if (!error) {
                        let jsonBody = JSON.parse(response.body)
                        console.log(response.body)

                        res.status(200)
                        res.render('book/view', {
                            title: bookID.title,
                            pageTitle: bookID.title,
                            book: bookID,
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
    } catch (e) {
        console.log(e)
        res.status(404)
        res.json({error: e})
    }
})

publicRouter.get('/books/:id/update', async (req, res) => {
    const {id} = req.params
    let o_id = new ObjectId(id);

    const bookID = await Book.findOne({"_id": o_id})

    if (bookID) {
        res.status(200)
        res.render('book/update', {
            title: bookID.title,
            pageTitle: bookID.title,
            book: bookID
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