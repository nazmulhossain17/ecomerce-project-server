const app = require("./app");
require('dotenv').config()
const port = 3001;


app.listen(port, ()=>{
    console.log(`Server running on PORT ${port}`)
}) 