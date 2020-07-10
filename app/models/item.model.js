const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    type: String,
    color: String,
    season: String,
    store: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Item', ItemSchema);
