const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

// connect to mongo database
mongoose.connect(process.env.URL_MONGO_DB, { useNewUrlParser: true })
const db = mongoose.connection


// throw error while running and once when connected
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to Atlas-Mongo_Database'))

// 'app' --> express middleware
// run database
app.listen(3000, () => console.log('server started'));
// allow server accept JSON
app.use(express.json())

// setting route for our authentications API
const authenticationsRouter = require('./routes/authentications')
app.use('/authentications', authenticationsRouter)


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