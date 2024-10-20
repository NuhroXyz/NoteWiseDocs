const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const readmeDir = path.join(__dirname, 'readme-files');

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(__dirname));

// Endpoint to list markdown files
app.get('/list-files', (req, res) => {
    fs.readdir(readmeDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to scan directory' });
        }
        // Filter only markdown files
        const readmeFiles = files.filter(file => file.endsWith('.md'));
        res.json(readmeFiles);
    });
});

// Serve the Markdown file content
app.get('/readme-files/:fileName', (req, res) => {
    const filePath = path.join(readmeDir, req.params.fileName);
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('File not found');
        }
        res.send(data);
    });
});

// Start the server on localhost
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
