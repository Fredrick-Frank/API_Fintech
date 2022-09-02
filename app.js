require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./config/database');
require('./middlewares/auth')

//setting up global details:
appName = 'API';

                                                                                                                                                                                                 
//connecting to the routes
const transaction = require('./src/routes/transaction');

const PORT = process.env.PORT || 8000;

const app = express();
app.listen(PORT, () => {console.log(`sever is listening at 8000`)});

//initializing the express framewwork:
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

//routes:
app.use('/', transaction);
app.use('/users/login', transaction)
app.use('/users/', transaction);
app.use('/users/:id/', transaction);
app.use('users/funds/transfer-funds/', transaction);
app.use('users/funds/fund-acct/', transaction);
app.use('users/funds/withdraw/', transaction);

module.exports = app;