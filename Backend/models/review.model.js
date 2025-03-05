const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    patientId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'patient'
        }
    ],
    doctorId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "doctor"
        }
    ],
    rating: {
        type: Number,
        required: true,
        min:1,
        max:5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("review",reviewSchema)