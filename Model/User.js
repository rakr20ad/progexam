// Vi skal lave et skema
// For alle kravene til en bruger
// "Schema" er basically i stedet for class User 
const mongoose = require('mongoose'); 

// Skemaet
const UserSchema = new mongoose.Schema ({
    name: {
        type: String, 
        required: true
    },
    username: {
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