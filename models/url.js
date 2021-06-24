const mongoose = require('mongoose')
// Define schema
const Schema = mongoose.Schema;

const UrlModelSchema = new Schema({
    url: String,
    status: Number,
    timeStamp: Date
});


const Url = mongoose.model('Urls', UrlModelSchema);
module.exports = Url;