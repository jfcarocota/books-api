const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name: String,
    genere: String,
    authorid: String
});

module.exports = mongoose.model('Book', bookSchema);