// INCLUDING THE ENVIRONMENT
require("dotenv").config()
// ALLOW THE CROSS ORIGIN RESOURCE SHARING
const cors = require('cors');
const path = require('path');

const express =  require('express');
const mongoose = require('mongoose');

const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());          // BODY PARSER : PARSE THE REQUEST BODY DATA (AS JSON)

// RUN BUILD '/' OR 'index.js' --> Run frontend
app.use(express.static(path.resolve( __dirname ,process.env.PUBLIC_DIR_MAIN))) 

// NOW,"public" DIRECTORY IS ALLOWED ACCESS TO IT'S DATA, WE CAN ACCESS STORED IMAGES IN "images" directory (stored by multer)
// Using path "/images/"+IMAGENAME
// app.use(express.static(path.resolve(__dirName , process.env.PUBLIC_DIR))) 
app.use(express.static(path.resolve(__dirname ,process.env.PUBLIC_DIR))) 

 // CONNECT TO THE MONGODB CLOUD OR MONGODB ATLAS
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(process.env.DBURL);
  console.log("connected")
}


app.use('/api/' , productRoutes.routes);
app.use('/api/' , userRoutes.routes);
app.use('/api/' , authRoutes.routes);           // FOR LOGIN AND SIGNUP
// Use the frontend routing at same server (REACT ROUTING)
app.use('*', (req,res)=>{
  res.sendFile(path.resolve(__dirname , "build" , "index.html"));
})

const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
})
