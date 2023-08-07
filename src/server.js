const mongoose= require("mongoose");
const app = require("./app");
require('dotenv').config()
const port = 3001;
const URL = process.env.DB_URL

mongoose.connect(URL).then(() => {
    console.log('Database Connected!')
});

app.listen(port, ()=>{
    console.log(`Server running on PORT ${port}`)
}) 