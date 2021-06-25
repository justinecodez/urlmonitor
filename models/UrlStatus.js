const mongoose = require('mongoose')
// Define schema
const Schema = mongoose.Schema;

const UrlStatusModelSchema = new Schema({
    url: String,
    status: Number,
    timeStamp: Date
});


const UrlStatus = mongoose.model('UrlStatuss', UrlStatusModelSchema);
module.exports = UrlStatus;