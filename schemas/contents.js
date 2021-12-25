var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    description: {type: String, default: ''},
    content: {type: String, default: ''},
    addTime: {type: Date, default: new Date()},

    views: {type: Number, default: 0},

    comments: {
        type: Array,
        default: []
    }

});

module.exports = schema;