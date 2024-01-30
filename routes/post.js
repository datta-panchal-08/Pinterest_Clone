var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

let postSchema = mongoose.Schema({
   user :{
    type : mongoose.Schema.Types.ObjectId,
    ref : "user"
   },
   title: String,
   description: String,
   image : String
});

module.exports= mongoose.model('post',postSchema);
