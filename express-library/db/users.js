const records = [
    {
        id: 1,
        username: 'user',
        password: '123456',
        displayName: 'demo user',
        emails: [{value: 'user@mail.ru'}],
    },
    {
        id: 2,
        username: 'jill',
        password: 'birthday',
        displayName: 'Jill',
        emails: [{value: 'jill@example.com'}],
    },
    {
        id: 3,
        username: 'user123',
        password: '123123',
        displayName: 'test user',
        emails: [{value: 'test@mail.ru'}],
    },
]

exports.findById = function (id, cb) {
    process.nextTick(function () {
        const idx = id - 1
        if (records[idx]) {
            cb(null, records[idx])
        } else {
            cb(new Error('User ' + id + ' does not exist'))
        }
    })
}

exports.findByUsername = function (username, cb) {
    process.nextTick(function () {
        let i = 0, len = records.length
        for (; i < len; i++) {
            const record = records[i]
            if (record.username === username) {
                return cb(null, record)
            }
        }
        return cb(null, null)
    })
}

exports.addUser = function (payload) {
    payload["id"] = records.length + 1
    records.push(payload)
}

exports.verifyPassword = (user, password) => {
    return user.password === password
}
