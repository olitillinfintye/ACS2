const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000; // Use port from environment or default to 3000

// This variable will hold the latest drawing data in memory.
let latestDrawingData = null;

// Use CORS to allow the web page to send requests to this server.
app.use(cors());
// Use express.text() to handle plain text POST bodies. Increase the limit for larger images.
app.use(express.text({ limit: '10mb' }));

// Endpoint for the website to upload the drawing
app.post('/upload', (req, res) => {
    console.log('Received a new drawing from the web client.');
    latestDrawingData = req.body;
    res.status(200).send({ message: 'Drawing received successfully!' });
});

// Endpoint for Unity to fetch the latest drawing
app.get('/drawing', (req, res) => {
    if (latestDrawingData) {
        console.log('Sending drawing to Unity client...');
        res.status(200).send(latestDrawingData);
        // Clear the data after sending it to prevent Unity from getting the same drawing repeatedly.
        latestDrawingData = null; 
    } else {
        // If there's no new drawing, send a "No Content" response.
        // This is an efficient way to let Unity know there's nothing new.
        res.status(204).send();
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}. Waiting for connections...`);
});
