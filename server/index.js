const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const app = express();
require('dotenv').config()

const PORT =  process.env.PORT || 7000;

app.use(express.json());
app.use(cors());

app.listen(PORT,()=>{
    console.log(`Listening to the port ${PORT}`)
});

app.use("/payment",routes)