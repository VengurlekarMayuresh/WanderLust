const { number } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reiewSchema = new mongoose.Schema({

    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

});

const Review = mongoose.model("Review",reiewSchema);
module.exports = Review;