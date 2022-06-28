const mongoose = require('mongoose');

let {
    db_link
} = require("../secrets");

mongoose.connect(db_link, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(db => {
    console.log("medical model connected");
}).catch((err) => {
    console.log(err);
})


const medicalSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phNo: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 8

    },

    confirmPassword: {
        type: String,
        required: true,
        min: 8,
        validate: function () {
            return this.password === this.confirmPassword
        }

    },

    role: {
        type: String,
        enum: ["doctor", "patient", "admin"],
        default: "patient"
    },

    fees: {
        type: String,
    },

    specs: {
        type: String,
        enum: ["Consult", "Diabetic", "Cardic", "ENT"]
    },

    // this is list of appointments for patients and docs
    list: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'appModel'
        }]
    },

    otp :{
        type : String
    },

})

medicalSchema.pre('save', function (next) {

    this.confirmPassword = undefined
    next()

})

const medicalModel = mongoose.model("medicalModel", medicalSchema);

module.exports = medicalModel;