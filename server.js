const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config(); // Load .env file

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // To serve index.html and style.css

// POST route to summarize
app.post('/summarize', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{
                    parts: [{ text: `Summarize this:\n${text}` }]
                }]
            }
        );

        const summary = response.data.candidates[0].content.parts[0].text;
        res.json({ summary });
    } catch (error) {
        console.error('Error summarizing text:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to summarize the text' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});