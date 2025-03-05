const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true, 
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] 
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    image: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    appointment: [
        {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "appointment" 
        }
    ],
    medicalHistory:[
        {
        diagnosis: String,
        treatment: String,
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "doctor"
        },
        date: Date
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("patient",patientSchema);