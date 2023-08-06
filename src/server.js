const express = require("express");
const app = express();
const morgan = require('morgan')
const port = 3001;


app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))



app.get("/", (req, res)=>{
    res.send("Hello")
})


app.use((req, res, next)=>{
    res.status(404).json({message: "404 not found"})
})

app.listen(port, ()=>{
    console.log(`Server running on PORT ${port}`)
})