const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // role: {
    //     type: String,
    //     default: "doctor"
    // },
    specialty: {
        type: String,
        required: true
    },
    location: {
        type: String,
        default: ""
    },
    experience: {
        type: Number,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    fees: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    // slot_booked: {
    //     type: Number,
    //     default: {},
    // },
    date:{
        type: Date,
        required: true
    },
    reviews: [
        {
        patientId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'patient', 
            // required: true 
        
        },
        feedback: { 
            type: String, 
            // required: true 
        },
        rating: { 
            type: Number, 
            // required: true, 
            min: 1, 
            max: 5 
        }
        }
    ],
    appointments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "appointment"
        }
    ],
    availability: [
        {
            day: { 
                type: String, 
                // required: true,
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            },
            timeSlots: [{ 
                type: String, 
                // required: true 
            }] 
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
},{minimize: false});  //we use minimize false to store empty objects in the slot_booked field

module.exports = mongoose.model("doctor",doctorSchema);