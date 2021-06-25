const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UrlSuccessModelSchema = new Schema({
    url: String,
    status: Number,
    statusText:String,
    timeStamp: Date
});


const UrlSuccess = mongoose.model('UrlSuccess', UrlSuccessModelSchema);
module.exports = UrlSuccess;