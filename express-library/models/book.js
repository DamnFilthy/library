const {Schema, model} = require('mongoose');

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    authors: {
        type: String,
        default: ""
    },
    comments: {
        type: Array,
        default: []
    },
    favorite: {
        type: String,
        default: ""
    },
    fileCover: {
        type: String,
        default: ""
    },
    fileName: {
        type: String,
        default: ""
    },
    fileBook: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Book = model("book", bookSchema);

// new Book({
//     title: "Сказать жизни «Да!»: психолог в концлагере",
//     description: "Эта удивительная книга сделала ее автора одним из величайших духовных учителей человечества в XX веке. В ней философ и психолог Виктор Франкл, прошедший нацистские лагеря смерти, открыл миллионам людей всего мира путь постижения смысла жизни.",
//     authors: "Виктор Франкл",
//     favorite: "Биографии и мемуары, Зарубежная публицистика",
//     fileCover: "Хит продаж",
//     fileName: "test.png",
//     fileBook: '/public/books/test.png'
// }).save().then(r => console.log(r)).catch(e => console.log(e))
//
// new Book({
//     title: "Will",
//     description: "Чему может научить нас простой парень, ставший самым высокооплачиваемым актером Голливуда",
//     authors: "Уилл Смитб Марк Мэнсон",
//     favorite: "second favorite",
//     fileCover: "second fileCover",
//     fileName: "test.png",
//     fileBook: '/public/books/test.png'
// }).save().then(r => console.log(r)).catch(e => console.log(e))
//
// new Book({
//     title: "Тонкое искусство пофигизма.",
//     description: "необходимо научиться искусству пофигизма. Определив то, до чего вам действительно есть дело, нужно уметь наплевать на все второстепенное, забить на трудности",
//     authors: "Марк Мэнсон",
//     favorite: " Зарубежная психология, Саморазвитие / личностный рост, Социальная психология",
//     fileCover: " Бестселлеры «New York Times», Борьба со стрессом, Поиск предназначения, Самореализация",
//     fileName: "test.png",
//     fileBook: '/public/books/test.png'
// }).save().then(r => console.log(r)).catch(e => console.log(e))

module.exports = model("book", bookSchema);