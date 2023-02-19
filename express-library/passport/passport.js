const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const db = require('../db')

const verify = (username, password, done) => {
    db.users.findByUsername(username, (err, user) => {
        if (err) {
            return done(err)
        }
        if (!user) {
            return done(null, false, {message: 'Неверный логин'})
        }

        if (!db.users.verifyPassword(user, password)) {
            return done(null, false, {message: 'Неверный пароль'})
        }

        return done(null, user)
    })
}

const options = {
    usernameField: "username",
    passwordField: "password",
}

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    db.users.findById(id, (err, user) => {
        if (err) {
            return done(err)
        }
        done(null, user)
    })
})

passport.use('local', new LocalStrategy(options, verify))

module.exports = passport