import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
const app = express();
import mongoose from 'mongoose';
dotenv.config();
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
app.get('/test',(req,res)=>{
res.json({
  message:'hello'
})
})
app.use('/api/user', userRoutes);