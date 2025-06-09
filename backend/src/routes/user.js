const Router = require("express").Router();
const { verifyAccessToken } = require("../middlewares/authentication");
const { checkIsPatient } = require("../middlewares/authentication");
const User = require("../models/user");
const Appointment = require("../models/appointment");
const lodash = require("lodash");

// GET /user/doctors - list all doctors for patients
Router.get("/doctors",
    verifyAccessToken,
    checkIsPatient,
    (req, res) => {
        console.log("User role in /doctors route:", req.userRole);
        return User.find({ role: "doctor" })
            .then(documents => {
                return res.status(200).json({
                    message: "user fetch successful",
                    error: null,
                    data: documents.map((doctor) => {
                        let doctorInfo = {
                            _id: doctor._id,
                            name: doctor.name,
                        };

                        if (doctor.profile) {
                            doctorInfo.specialization = doctor.profile.specialization;
                            doctorInfo.address = doctor.profile.address;
                        }

                        return doctorInfo;
                    })
                });
            })
            .catch(error => {
                console.log(" error: ", error);

                return res.status(422).json({
                    message: "user fetch failed",
                    error: error,
                    data: null
                });
            });
    });

// GET /user/patients - list all patients for doctors
Router.get("/patients",
    verifyAccessToken,
    (req, res, next) => {
        console.log("User role in /patients route:", req.userRole);
        if (req.userRole !== "doctor") {
            return res.status(403).json({
                message: "Access denied",
                error: "Forbidden",
                data: null
            });
        }
        next();
    },
    (req, res) => {
        return User.find({ role: "patient" })
            .then(documents => {
                return res.status(200).json({
                    message: "user fetch successful",
                    error: null,
                    data: documents.map((patient) => {
                        let patientInfo = {
                            _id: patient._id,
                            name: patient.name,
                        };

                        if (patient.profile) {
                            patientInfo.age = patient.profile.age;
                            patientInfo.address = patient.profile.address;
                        }

                        return patientInfo;
                    })
                });
            })
            .catch(error => {
                console.log(" error: ", error);

                return res.status(422).json({
                    message: "user fetch failed",
                    error: error,
                    data: null
                });
            });
    }
);

module.exports = Router;
