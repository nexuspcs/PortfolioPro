// index.js

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const ClothingItem = require('./models/ClothingItem');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/clothing_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Define storage for uploaded images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Define routes
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const { name, category } = req.body;
        const imageUrl = req.file.path;
        console.log('Uploaded file:', req.file);
        console.log('Body:', req.body);
        const clothingItem = new ClothingItem({ name, category, imageUrl });
        await clothingItem.save();
        console.log('Clothing item saved:', clothingItem);
        res.status(201).json({ message: 'Clothing item uploaded successfully' });
    } catch (err) {
        console.error('Error uploading clothing item:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
