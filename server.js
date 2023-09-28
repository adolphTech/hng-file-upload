const express = require('express');
const app = express();
const PORT = 3000;
const multer = require('multer');
const path = require("path");
const fs = require("fs")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post('/upload-video', upload.single('my-video'), (req, res) => {
    if (req.file) {
        // Generate a URL link to the uploaded video
        const videoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        
        console.log(`Video uploaded: ${req.file.filename}`);
        console.log(`Video URL: ${videoUrl}`);

        // Send the URL link as the response
        res.json({link:videoUrl,message:"video saved"});
    } else {
        res.status(400).send('No video file uploaded.');
    }
});

// ... Previous code ...

// Serve uploaded videos
app.get('/uploads/:filename', (req, res) => {
    const videoFilePath = path.join(__dirname, 'uploads', req.params.filename);
    
    // Check if the video file exists
    if (fs.existsSync(videoFilePath)) {
        // Use the 'video/mp4' MIME type for video files (adjust as needed)
        res.setHeader('Content-Type', 'video/mp4');
        
        // Stream the video file to the response
        const videoStream = fs.createReadStream(videoFilePath);
        videoStream.pipe(res);
    } else {
        // Return a 404 error if the video file does not exist
        res.status(404).send('Video not found');
    }
});




app.listen(PORT, () => {
    console.log(`Yay 🎉, Server is running on port: ${PORT}`);
});
