const mongoose = require('mongoose');

const UserInventorySchema = mongoose.Schema({
    userID: String,
    items: Array,
}, {
    timestamps: true
});

module.exports = mongoose.model('UserInventory', UserInventorySchema);