const express = require('express');
const routes = express.Router();
const productControllers = require('../controllers/product')
const { isLogIn } = require('../middlewares/middlewares');
const path = require("path");


const multer= require('multer');
const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null, "public/Images");
    },
    filename : function(req,file,cb){
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
        // myFile + "_" + 23423431 +.jpg/.png/.jpeg
    }
})
const upload = multer({storage: storage})

routes.get('/products/product:id', productControllers.getProductById)
.get('/products?', productControllers.getfilteredProducts)
.post('/uploads', upload.single("myFile"), productControllers.uploadImage)
.post('/products/product/add', isLogIn,productControllers.createProduct)    
.delete('/products/product/delete:id', isLogIn , productControllers.deleteProduct); 

exports.routes = routes; 

// NOTE: IMAGE ACCESSIBLE USING ( FRONTEND )
{/* <img src={'https://localhost:8000/Images/'+IMAGENAME} alt=""></img> */}

// "/uploads" ROUTE IS ONLY FOR IMAGE (store the name created by "filename" in MongoDB Cloud/Atlas) AS STRING.