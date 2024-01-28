// const mongoose = require('mongoose');
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  userName: { type: String , minLength: 3 ,required:[true, "UserName is must to provide (Signup form)"] },
  token : String,
  email: {
    type: String,
    required: [true, "Email is must to provide"],
    unique: [ true ,"Invalid Email!!! Email already exists. Please try new or another email.", ],
    validate : {validator : function(v){
      return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
    },
    message : (props)=>`${props.value} is not a valid email` 
  }
  },
  password: { type: String, minLength :6  ,required: [true, "Password is must to provide"] },
  phone: { type: Number, minLength :10 ,maxLength :10 ,
  validate:{validator : function(v){
    return /\d{3}-\d{3}-\d{4}/.test(v);
  }, message: props=>`${props.value} is not a valid phone number`} 
},
  address: { addressLine:String, city:String, state:String, pinCode:Number, country:String },
  cart: [
    { _id : String,
      product_name: { type: String, required: [true, "Product name is must to provide"], },
      description: String,
      category: String,
      metal: { type: String, required: true },
      weight: { type: Number, required: true },
      price: { type: Number, min: 0, required: [true, "Product price is must to provide"], },
      img: [String],
      height: { type: Number, max: 999, min: 0, default: 0 },
      width: { type: Number, max: 999, min: 0, default: 0 },
      company: { type: String, default: "Unknown small enterprise" },
      quantity: { type: Number, default: 1, max: 100, min: 1 }
    }
  ],
  cartDetails: {
    totalQuantity : {type:Number, min:0 , default:0 },
    totalAmount : {type:Number, min:0 , default:0 },
    grandTotal : {type:Number, min:0 , default:0 },
    shippingCharges :{type:Number, min:0 , default:0 },
    totalWeight :{type:Number, min:0 , default:0 },
  }, 
  orders: [
    {
      orderProducts: [
        {
          product_name: { type: String, required: [true, "Product name is must to provide"], },
          description: String,
          category: String,
          metal: { type: String, required: true },
          weight: { type: Number, min: 1, required: true },
          price: { type: Number, min: 0, required: [true, "Product price is must to provide"], },
          img: [String],
          height: { type: Number, max: 999, min: 0, default: 0 },
          width: { type: Number, max: 999, min: 0, default: 0 },
          company: { type: String, default: "Unknown small enterprise" },
          quantity: { type: Number, default: 1, max: 100, min: 1 }
        },
      ],
      orderDate: { type: Date, default: Date.now() },
      orderAddress: { addressLine:String, city:String, state:String, pinCode:Number, country:String },
      orderPhone:{ type: Number, minLength :10 ,maxLength :10 },
      orderTotal: Number,
    },
  ],
});

exports.user = model("user", userSchema);