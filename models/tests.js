const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TestSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: [mongoose.Schema.Types.ObjectId],
});

module.exports = mongoose.model('Test', TestSchema);