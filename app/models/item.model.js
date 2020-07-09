const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    type: String,
    color: String,
    season: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Item', ItemSchema);
