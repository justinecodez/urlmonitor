const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UrlFailModelSchema = new Schema({
    url: String,
    status: Number,
    statusText:String,
    timeStamp: Date
});


const UrlFail = mongoose.model('UrlFail', UrlFailModelSchema);
module.exports = UrlFail;