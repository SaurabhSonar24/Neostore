const mongoose = require('mongoose')
//dbconnection 
const db = "mongodb://localhost:27017/neostore";
const connectDB = async () => {
    try {
        await mongoose.connect(db, { useNewUrlParser: true });
        console.log("MongoDB connected")
    }
    catch (err) {
        console.log(err.message);
    }
}
connectDB();
module.exports = connectDB()
//end