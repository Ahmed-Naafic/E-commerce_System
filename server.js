const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();


const PORT = process.env.PORT || 5000;

mongoose
.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Database connected seccesfully");
    
    app.listen(PORT,()=>{
        console.log(`the server is running at ${PORT}`)
    })
})
.catch((error)=>{
  console.log(error)
});