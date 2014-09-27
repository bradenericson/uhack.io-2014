/**
 * Created by braden on 9/26/14.
 */



var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/*
types:
 String
 Number
 Date
 Buffer
 Boolean
 Mixed
 ObjectId
 Array

 */

var UserSchema = new Schema({
    email: String,          //email (acts as primary key)
    password: String,       //plaintext password
    gender: String,         //m or f
    height: Number,         //height in inches
    shirt: String,          //t-shirt size
    legLength: Number,      //pants length
    waist: Number,           //waist size
    reviews: Array          //holds the reviews written by the user
});

UserSchema.virtual('date')
    .get(function(){
        return this._id.getTimestamp();
    });

mongoose.model('User', UserSchema);

