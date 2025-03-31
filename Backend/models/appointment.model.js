const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema({
  patientId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
    },
  ],
  doctorId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
    },
  ],
  appointmentDate: {
    type: Date,
    required: true,
  },
  timeslot: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "completed", "cancelled"],
  },
  reason: {
    type: String,
    default: "", 
  },
  notes: {
    type: String,
    default: "", 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("appointment", appointmentSchema);
