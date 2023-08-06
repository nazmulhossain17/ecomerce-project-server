const express = require("express");
const app = express();
const morgan = require('morgan')
const port = 3001;


app.use(morgan('dev'))


app.get("/", (req, res)=>{
    res.send("Hello")
})


app.listen(port, ()=>{
    console.log(`Server running on PORT ${port}`)
})