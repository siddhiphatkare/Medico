const { default: mongoose } = require("mongoose")
const { getEpochMilliSeconds, checkIsDateTimeFuture } = require("../helper")
const { verifyAccessToken, checkIsPatient } = require("../middlewares/authentication")
const Appointment = require("../models/appointment")
const User = require("../models/user")
const lodash = require("lodash")

const Router = require("express").Router()

Router.post("/", 
    verifyAccessToken,
    checkIsPatient,
    (req, res) => {
    const newAppointment = req.body

    return Promise.resolve()
    .then(() => {
        if(!newAppointment.dateTime) {
            throw "invalid date time"
        }
    })
    .then(() => getEpochMilliSeconds(newAppointment.dateTime))
    .then((milliseconds) => checkIsDateTimeFuture(milliseconds))
    .then((milliseconds) => { 
        newAppointment.dateTime = milliseconds
        return  Appointment.create(newAppointment)
    })
    .then(doc => {
        return res.status(201).json({
            message: "appointment create successful",
            error: null,
            data: { ...doc._doc }
         })
    })
    .catch(error => {
        console.log("===error : ", error)
        return res.status(422).json({
            message: "appointment create failed",
            error: error,
            data: null
         })
    })

})

Router.get("/", verifyAccessToken, (req, res) => {
    const role = req.query.role;

    if (!role || (role !== "doctor" && role !== "patient")) {
        return res.status(400).json({
            message: "Invalid or missing role query parameter",
            error: "Bad Request",
            data: null
        });
    }

    if(role === "doctor") {
        return User.findOne({ email: req.userEmail, role: "doctor" })
        .then(doctor => {
            if(!doctor) {
                throw "not found"
            }
            return Appointment.find({ doctorId: new mongoose.Types.ObjectId(doctor._id) })
        })
        .then(appts => {
            return res.status(200).json({
                message: "appointments fetch successful",
                error: null,
                data: appts
            })
        })
        .catch(error => {
            console.log("=== error", error)
            return res.status(422).json({
                message: "appointment fetch failed",
                error: error,
                data: null
            })
        })
    }

    if(role === "patient") {
        return User.findOne({ email: req.userEmail, role: "patient" })
        .then(patient => {
            if(!patient) {
                throw "not found"
            }
            return Appointment.find({ patientId: new mongoose.Types.ObjectId(patient._id) })
            .populate("doctorId")
            .exec()
        })
        .then(appts => {
            return res.status(200).json({
                message: "appointments fetch successful",
                error: null,
                data: appts
            })
        })
        .catch(error => {
            console.log("=== error", error)
            return res.status(422).json({
                message: "appointment fetch failed",
                error: error,
                data: null
            })
        })
    }
})

Router.put("/:appointmentId", verifyAccessToken, (req, res) => {
    const userRole = req.userRole
    const userEmail = req.userEmail
    const updateData = req.body

    if (lodash.isEmpty(updateData)) {
        return res.status(422).json({
            message: "invalid request body",
            error: "Empty update data",
            data: null
        })
    }

    // Patient can only cancel their own appointment
    if (userRole === "patient") {
        if (updateData.status && updateData.status !== "cancelled") {
            return res.status(403).json({
                message: "Patients can only cancel appointments",
                error: "Forbidden",
                data: null
            })
        }
        // Verify appointment belongs to patient
        return Appointment.findOne({ _id: req.params.appointmentId })
            .then(appt => {
                if (!appt) {
                    throw "Appointment not found"
                }
                if (appt.patientId.toString() !== req.userId) {
                    throw "Unauthorized to cancel this appointment"
                }
                return Appointment.findByIdAndUpdate(req.params.appointmentId, { status: "cancelled" }, { new: true })
            })
            .then(updatedAppt => {
                return res.status(200).json({
                    message: "appointment cancelled successfully",
                    error: null,
                    data: updatedAppt
                })
            })
            .catch(error => {
                console.log("=== error", error)
                return res.status(422).json({
                    message: "appointment cancellation failed",
                    error: error,
                    data: null
                })
            })
    }

    // Doctor can update status to accept, pending, complete
    if (userRole === "doctor") {
        if (updateData.status && !["accepted", "pending", "complete"].includes(updateData.status)) {
            return res.status(403).json({
                message: "Invalid status update by doctor",
                error: "Forbidden",
                data: null
            })
        }
        // Verify appointment belongs to doctor
        return Appointment.findOne({ _id: req.params.appointmentId })
            .then(appt => {
                if (!appt) {
                    throw "Appointment not found"
                }
                if (appt.doctorId.toString() !== req.userId) {
                    throw "Unauthorized to update this appointment"
                }
                return Appointment.findByIdAndUpdate(req.params.appointmentId, updateData, { new: true })
            })
            .then(updatedAppt => {
                return res.status(200).json({
                    message: "appointment updated successfully",
                    error: null,
                    data: updatedAppt
                })
            })
            .catch(error => {
                console.log("=== error", error)
                return res.status(422).json({
                    message: "appointment update failed",
                    error: error,
                    data: null
                })
            })
    }

    return res.status(403).json({
        message: "Unauthorized role for appointment update",
        error: "Forbidden",
        data: null
    })
})

module.exports = Router
