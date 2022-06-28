const express = require('express');
const medicalModel = require('../model/medicalModel');
const {
    protectRoute,
    isAuth
} = require('./authHelper');

const docRouter = express.Router();

docRouter.route("/add").post(protectRoute, isAuth(['admin']), addDoc)
docRouter.route("/getAllDocs").post(protectRoute, isAuth(['admin']), getAllDoc)
docRouter.route("/getAllPat").post(protectRoute, isAuth(['admin']), getAllPat)
docRouter.route("/delDoc").post(protectRoute, isAuth(['admin']), deleteDoc)
docRouter.route("/getWspec").post(getDocWspec)

// add doctor

async function addDoc(req, res) {

    try {

        let userObj = req.body;
        let doctor = await medicalModel.create(userObj);

        res.json({
            message: "New doctor added",
            doctor
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// delete doctor
async function deleteDoc(req, res) {
    try {

        let deleDoc = await medicalModel.findOneAndRemove({
            email: req.body.email
        });


        res.json({
            deleDoc,
            message: "Doctor removed"
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

//get all doctors
async function getAllDoc(req, res) {
    try {

        let allDoc = await medicalModel.find({
            role: "doctor"
        });

        res.json({
            docs: allDoc
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

//get doctor with speciality

async function getDocWspec(req, res) {
    try {

        let specDoc = await medicalModel.find({
            specs: req.body.specs
        });

        res.json({
            docs: specDoc
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


// get all patients
async function getAllPat(req, res) {
    try {

        let allPat = await medicalModel.find({
            role: "patient"
        });

        res.json({
            pats: allPat
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = docRouter