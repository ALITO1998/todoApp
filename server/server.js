const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;

// Middleware to handle CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());


// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Function to read data from the JSON file
const readData = () => {
    const data = fs.readFileSync('data.json');
    return JSON.parse(data);
};

// Function to write data to the JSON file
const writeData = (data) => {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

// GET endpoint
app.get('/api/items', (req, res) => {
    const items = readData();
    res.json(items);
});

// POST endpoint
app.post('/api/items', (req, res) => {
    const items = readData();
    const newItem = { id: items.length + 1, ...req.body };
    items.push(newItem);
    writeData(items);
    res.status(201).json(newItem);
});

// PUT endpoint
app.put('/api/items/:id', (req, res) => {
    const items = readData();
    const itemId = req.params.id; // Keep itemId as string
    const itemIndex = items.findIndex(item => item.id == itemId);
    if (itemIndex >= 0) {
        items[itemIndex] = { id: itemId, ...req.body };
        writeData(items);
        res.json(items[itemIndex]);
    } else {
        res.status(404).send('Item not found');
    }
});



// DELETE endpoint
app.delete('/api/items/:id', (req, res) => {
    let items = readData();
    const itemId = req.params.id;

    const itemIndex = items.findIndex(item => item.id == itemId); // Loose equality to match both string and number
    if (itemIndex >= 0) {
        const deletedItem = items[itemIndex];
        items = items.filter(item => item.id != itemId); // Loose equality to match both string and number
        writeData(items);
        res.status(200).json({ message: 'Item deleted successfully', item: deletedItem });
    } else {
        res.status(404).send('Item not found');
    }
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
