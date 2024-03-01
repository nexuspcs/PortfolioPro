// models/ClothingItem.js

const mongoose = require('mongoose');

const clothingItemSchema = new mongoose.Schema({
    name: String,
    category: String,
    imageUrl: String,
});

const ClothingItem = mongoose.model('ClothingItem', clothingItemSchema);

module.exports = ClothingItem;
