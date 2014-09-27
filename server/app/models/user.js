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
    name: {
        first: String,      //first name
        last: String        //last name
    },
    email: String,          //email (acts as primary key)
    password: String,       //plaintext password
    gender: String,         //m or f
    height: Number,         //height in inches
    shirt: String,          //t-shirt size
    pants: {
        length: Number,
        waist: Number
    },
    reviews: Array          //holds the reviews written by the user
});

UserSchema.virtual('fullname')
    .get(function(){
        return this.name.first + " " + this.name.last;
    });

mongoose.model('User', UserSchema);

