const express = require('express');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleWere/errorMiddlewere');
const app = express();
require('dotenv').config();
const cors = require("cors");
const axios = require('axios');

app.use(cors({
  origin: ['http://13.234.113.29:5173', 'http://localhost:5173'],
  credentials: true
}))

const PORT = process.env.PORT || 5000;

//DataBase connection
connectDB();
//body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/images', express.static('images'));


app.get('/', (req, res) => {
  res.send('Wellcome to GOLF club');
});

//Routes

app.use('/api/user', require('./Routes/userRoute'));
app.use('/api/admin', require('./Routes/adminRoute'));
app.use('/api/golf', require('./Routes/GolfCourseRoute'));
app.use('/api/public', require('./Routes/public'));
app.use('/api/game', require('./Routes/game/gameRoundRoute'));
app.use('/api/report', require('./Routes/game/performanceRoute'));
app.use('/api/lession', require('./Routes/lession'));
app.use('/api/practice', require('./Routes/practice'));
// app.use('/api/product', require('./Routes/productRoute'));

app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`server is running at PORT :- ${PORT}`);
});
