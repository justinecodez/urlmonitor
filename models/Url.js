const mongoose = require('mongoose')
// Define schema
const Schema = mongoose.Schema;

const UrlModelSchema = new Schema({
    url: String
});


const Url = mongoose.model('Urls', UrlModelSchema);
module.exports = Url;