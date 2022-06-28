const express = require('express');
const upload = require('../helper/multer');
const cloudinary = require('../helper/cloudinary')
const medicalModel = require('../model/medicalModel');
const appModel = require('../model/appointmentModel');


const uploadRouter = express.Router();

uploadRouter.route('/prescription').post(upload.single('image'), uploadImg);

// upload img
async function uploadImg(req, res) {

    try {

        let fileStr = req.body.reportImg;

        let name = req.body.name

        const result = await cloudinary.uploader.upload(fileStr);
        // const result = await cloudinary.uploader.upload(req.file.path);

        let apoint = await appModel.findOneAndUpdate({
            patName: name
        }, {
            $set: {
                cloudinary_id: result.public_id,
                avatar: result.secure_url
            },

        }, {
            new: true,
            useFindAndModify: false
        })

        // console.log(apoint);

        res.json({
            apoint
        })

    } catch (error) {
        res.json({
            error: error.message
        })
    }

}

module.exports = uploadRouter