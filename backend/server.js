const connectToMongo = require('./db.js');
connectToMongo();

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); // Used to access req.body in console.log

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port,()=>{
    console.log(`App is running on port : ${port}`);
})