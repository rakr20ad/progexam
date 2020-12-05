//we need to create a schema 
//of all of the different fields for our user
//Schema er basically i stedet for class User (tror jeg)
const mongoose = require('mongoose'); 

//creating our schema 
const UserSchema = new mongoose.Schema ({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    age: {
        type: Number, 
        required: true
    },
    Gender: {
        type: String, 
        required: true
    }, 
    prefGender: {
        type: String, 
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    date: {
        type: Date, 
        default: Date.now
    }
}); 

const User = mongoose.model('User', UserSchema); 

module.exports = User; 