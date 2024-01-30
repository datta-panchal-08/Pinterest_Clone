var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://localhost:27017/pin");

let userSchema = mongoose.Schema({
   username: String,
   fullname : String,
   email: String,
   password: String,
   contact: Number,
   profileImage: String,
   boards: {
     type: Array,
     default: []
   },
   posts:[
     {
       type: mongoose.Schema.Types.ObjectId,
       ref: "post"
     }
   ]
 });
 
 userSchema.plugin(plm);
 
 module.exports = mongoose.model('user', userSchema);
 