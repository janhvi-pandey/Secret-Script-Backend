const express=require('express');
const dotenv=require('dotenv');
const connectmongo = require('./Database/db')
const cors = require('cors');


const app=express();
dotenv.config();
app.use(cors({
    origin: 'https://secret-script-io.vercel.app',
    credentials: true
}));
app.use(express.json());
connectmongo();

app.use('/auth', require('./routes/auth'));
app.use('/notes',require('./routes/notes'));
app.get('/',(req,res)=>{
    res.send('Server is running perfectly') 
})

module.exports = app;