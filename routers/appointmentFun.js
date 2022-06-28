const express = require('express');
const sendMail = require('../helper/sendMail');
const appModel = require('../model/appointmentModel');
const medicalModel = require('../model/medicalModel');
const {
    protectRoute,
    isAuth
} = require('./authHelper');

const appRouter = express.Router();

appRouter.route("/addApp").post(protectRoute, addApp)
appRouter.route("/delApp").post(protectRoute, isAuth(['admin', 'patient']), delApp)
appRouter.route("/updApp").post(protectRoute, updApp);
appRouter.route("/getApp").post(protectRoute, getAll);
appRouter.route("/getApps").post(protectRoute,isAuth(['admin']), getAllApp);



// booking appointment
async function addApp(req, res) {

    try {

        let appDetails = req.body;

        let appoint = await appModel.create(appDetails);

        let {
            aId
        } = req


        // populating patients appointment list

        let patList = await medicalModel.findOneAndUpdate({
            email: aId
        }, {
            $push: {
                list: `${appoint._id}`
            }
        }, {
            new: true,
            useFindAndModify: false
        }).populate('list')


        // populating doctors appointment list

        let docList = await medicalModel.findOneAndUpdate({
            name: appoint.docName
        }, {
            $push: {
                list: `${appoint._id}`
            }
        }, {
            new: true,
            useFindAndModify: false
        }).populate('list')

        sendMail(appoint,aId)

        res.json({
            message: "You have an appointment"
        })


    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// deleting appointment
async function delApp(req, res) {

    try {

        let appId = req.body.appId;

        let appoint = await appModel.find({
            _id: appId
        })

        let aPat = await medicalModel.findOneAndUpdate({
            name: appoint[0].patName
        }, {
            $pullAll: {
                list: [appId]
            }
        }, {
            new: true,
            useFindAndModify: false
        })

        console.log(aPat);

        let aDoc = await medicalModel.findOneAndUpdate({
            name: appoint[0].docName
        }, {
            $pullAll: {
                list: [appId]
            }
        }, {
            new: true,
            useFindAndModify: false
        })

        let delAppoint = await appModel.findOneAndDelete({
            _id: appId
        })

        res.json({
            message: "App deleted"
        })

    } catch (error) {

    }
}

// get all appointment->doctor/patient
async function getAll(req,res){
    try {

        let {aId} = req;

        let user = await medicalModel.find({
            email : aId
        }).populate('list')

        res.json({
            message:"All appointments",
            appList : user[0].list 
        })
        
    } catch (error) {
        
    }
}

async function getAllApp(req,res){
    try {

        let apps = await appModel.find({})
        

        res.json({
            message:"All appointments",
            appList : apps
        })
        
    } catch (error) {
        
    }
}

// update appointment
async function updApp(req, res) {
    try {
        // time and date changing option

    } catch (error) {

    }
}

module.exports = appRouter;