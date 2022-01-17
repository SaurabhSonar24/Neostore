const express = require('express')
const cors=require("cors")
const PORT = 3002;
const app = express()
const db=require("./config/db")
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())
/////////database connect
db
///////////////
const postRoutes=require('./routes/postRoutes')
app.use('/api/',postRoutes)

app.listen(PORT, (err) => {
    if (err) throw err;
    else {
        console.log("Server runs on " + PORT)
    }
})