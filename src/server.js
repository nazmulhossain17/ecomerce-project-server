const mongoose= require("mongoose");
const app = require("./app");
require('dotenv').config()
const port = 3001;
const URL = process.env.DB_URL

const connectDB = async(req, res)=>{
    try {
        await mongoose.connect(URL);
        console.log('Database Connected!');
        app.listen(port, ()=>{
            console.log(`Server running on PORT ${port}`)
        }) 
    } catch (error) {
        res.status(404).send(error.message)
    }
}

connectDB(); 