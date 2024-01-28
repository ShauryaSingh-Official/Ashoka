const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_name: {type : String , required : [true,"Product name is must to provide"]},
  description:{ type : String,  default : "-----"},
  category : String,
  metal: {"type" : String, required:true },
  weight : {type : Number , min:0.00001 , required : true },
  price: {type : Number , max:999999 , min:0 , required: [true,"Product price is must to provide"]},
  img: String,
  height: {type : Number , max:9999 , min:0 , default : 0},
  width:{type : Number , max:9999 , min:0 , default : 0},
  length:{type : Number , max:9999 , min:0 , default : 0},
  company: {type : String , default : "Not specified"},
});

exports.Product = mongoose.model('product' , productSchema);
