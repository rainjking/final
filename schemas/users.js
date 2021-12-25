var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    username: String,
    password: String,
    isSuperAdmin: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = schema;