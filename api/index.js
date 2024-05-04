// import express from 'express';
// import dotenv from 'dotenv';
// import userRoutes from './routes/user.route.js';
// import authRoutes from './routes/auth.route.js';
// import cookieParser from 'cookie-parser';
// import listingRouter from './routes/listing.route.js';
// import path from 'path';
// import { spawn } from 'child_process';

// process.env.PYTHON = '/opt/anaconda3/bin/python';
// const app = express();
// app.use(express.json());
// app.use(cookieParser());

// import mongoose from 'mongoose';
// dotenv.config();

// app.listen(3000, () => {
//     console.log('Server is running on port 3000!');
// });

// mongoose.connect(process.env.MONGO)
//     .then(() => {
//         console.log('Connected to MongoDB!');
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// app.get('/predict', (req, res) => {
//     console.log('Received prediction request:', req.query); // Log the request parameters
//     const { location, sqft, bedrooms, baths } = req.query;

//     // Execute Python script
//     const pythonProcess = spawn('/opt/anaconda3/bin/python', ['./api/script.py', location, sqft, bedrooms, baths]);

//     let prediction = null;

//     pythonProcess.stdout.on('data', (data) => {
//         const predictedPrice = parseFloat(data.toString()); 
        
//         console.log('I am hera')// Convert data to string and parse as float
//         console.log(`Predicted Price is: ${predictedPrice}`);
//         console.log(typeof(predictedPrice))
     
//         prediction = predictedPrice;
//     });

//     pythonProcess.stderr.on('data', (data) => {
//         console.error(`Error in Python script: ${data}`);
//     });

//     pythonProcess.on('close', (code) => {
//         console.log(`Python script process exited with code ${code}`);
//         if (prediction !== null) {
//             console.log('I am sending response')
//             res.json({ prediction: prediction.toString() }); // Send the prediction back to the frontend as a string
//         } else {
//             res.status(500).json({ success: false, message: 'Prediction not available' });
//         }
//     });
// });


// const __dirname = path.resolve();
// app.use('/api/user', userRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/listing', listingRouter);

// app.use(express.static(path.join(__dirname, '/client')));
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client', 'index.html'));
// });
import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listing.route.js';
import path from 'path';
import { spawn } from 'child_process';
import cors from 'cors'; // Import cors middleware

process.env.PYTHON = '/opt/anaconda3/bin/python';
const app = express();
app.use(express.json());
app.use(cookieParser());

import mongoose from 'mongoose';
dotenv.config();

// Enable CORS middleware
app.use(cors());

app.listen(3000, () => {
    console.log('Server is running on port 3000!');
});

mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log('Connected to MongoDB!');
    })
    .catch((err) => {
        console.log(err);
   
    });

app.get('/predict_lahore', (req, res) => {
    console.log('Received prediction request:', req.query); // Log the request parameters
    const { location, sqft, bedrooms, baths } = req.query;

    // Execute Python script
    const pythonProcess = spawn('/opt/anaconda3/bin/python', ['./api/script.py', location, sqft, bedrooms, baths]);

    let prediction = null;

    pythonProcess.stdout.on('data', (data) => {
        const predictedPrice = parseFloat(data.toString()); 
        
        console.log('I am here'); // Corrected spelling mistake
        console.log(`Predicted Price is: ${predictedPrice}`);
        console.log(typeof(predictedPrice));
     
        prediction = predictedPrice;
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error in Python script: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python script process exited with code ${code}`);
        if (prediction !== null) {
            console.log('I am sending response');
            res.json({ prediction: prediction.toString() }); // Send the prediction back to the frontend as a string
        } else {
            res.status(500).json({ success: false, message: 'Prediction not available' });
        }
    });
});
app.get('/predict_karachi', (req, res) => {
    console.log('Received prediction request:', req.query); // Log the request parameters
    const { location, sqft, bedrooms, baths } = req.query;

    // Execute Python script
    const pythonProcess = spawn('/opt/anaconda3/bin/python', ['./api/karachi.py', location, sqft, bedrooms, baths]);

    let prediction = null;

    pythonProcess.stdout.on('data', (data) => {
        const predictedPrice = parseFloat(data.toString()); 
        
        console.log('I am here'); // Corrected spelling mistake
        console.log(`Predicted Price is: ${predictedPrice}`);
        console.log(typeof(predictedPrice));
     
        prediction = predictedPrice;
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error in Python script: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python script process exited with code ${code}`);
        if (prediction !== null) {
            console.log('I am sending response');
            res.json({ prediction: prediction.toString() }); // Send the prediction back to the frontend as a string
        } else {
            res.status(500).json({ success: false, message: 'Prediction not available' });
        }
    });
});


const __dirname = path.resolve();
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__dirname, '/client')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

