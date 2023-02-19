const express = require('express');
const authRouter = express.Router();
const {passport} = require('../passport');
const db = require('../db')

authRouter.get('/', async (req, res) => {
    res.render('user/login', {query : req.query})
})

authRouter.post('/', passport.authenticate('local', {
        failureRedirect: '/auth?loginError=true',
        failureMessage: true,
    }),
    (req, res) => {
        res.redirect('/')
    }
)

authRouter.get('/register', (req, res) => {
    res.render('user/register', {message: ''})
})

authRouter.post('/register', (req, res) => {
    const payload = {
        username: req.body.username,
        password: req.body.password,
        displayName: req.body.displayName,
        emails: [{value: req.body.email}],
    }

    db.users.findByUsername(req.body.username, function (err, user, next) {
        if (err) {
            res.render('user/register', {message: 'Произошла ошибка: ' + err});
        }
        if (user) {
            res.render('user/register', {message: 'Пользователь с таким логином уже существует'});
        }
        if (!user) {
            db.users.addUser(payload);
            passport.authenticate('local', function (err, user, next) {
                if (err) {
                    return res.render('user/register', {message: 'Произошла ошибка: ' + err});
                }
                req.logIn(user, function (err) {
                    if (err) {
                        return res.render('user/register', {message: 'Произошла ошибка: ' + err});
                    }
                    return res.redirect('/');
                });

            })(req, res, next);
        }
    })
})

authRouter.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
})

authRouter.get('/profile',
    (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.redirect('/auth')
        }
        next()
    },
    (req, res) => {
        res.render('user/profile', {user: req.user})
    }
)

module.exports = authRouter