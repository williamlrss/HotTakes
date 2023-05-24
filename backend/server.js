'use strict';

const authenticationsRouter = require('./routes/authentications');
const saucesRouter = require('./routes/sauces');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();

// Create Express app
const app = express();
app.use(cors());
// Connect to the MongoDB database
mongoose.connect(process.env.URL_MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});

mongoose.connection.once('open', () => {
    console.log('Connected to Atlas-Mongo_Database');
});


// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authenticationsRouter);
app.use('/api/sauces', saucesRouter);

// Error handling middleware
app.use((err, res) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));

// const multer = require('multer');
// const userRoutes = require('./routes/userRoutes');
//
// const cors = require('cors');

// // Additional code for setting up routes, middleware, and starting the server
// app.use(
//   cors({
//     origin: 'http://localhost:4200',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//   })
// );

// app.use(express.json());

// // Register the user routes
// app.use('/api/users', userRoutes);

// // Multer configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Set the destination directory for uploaded files
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix); // Set the filename for uploaded files
//   }
// });

// const upload = multer({ storage });

// // Example route for file upload
// app.post('/api/upload', upload.single('file'), (req, res) => {
//   // Handle the uploaded file here
//   // Access the uploaded file using req.file
//   // Process the file, save it to the database, etc.
//   res.status(200).json({ message: 'File uploaded successfully' });
// });

// // Serve uploaded sauce images
// app.use('/uploads', express.static('uploads'));

// // Example: Define a route
// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Error:', err);
//   res.status(500).json({ error: 'Internal Server Error' });
// });

// // Start the server
// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });