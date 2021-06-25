const mongoose = require('mongoose')
// Define schema
const Schema = mongoose.Schema;

const TimeModelSchema = new Schema({
    time
});

// Compile model from schema
const TimeModel = mongoose.model('TimeModel', TimelModelSchema);