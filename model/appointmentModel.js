const mongoose = require('mongoose');

let {PASSWORD} =process.env || require('../secrets')

let db_link = `mongodb+srv://shrey_2000:${PASSWORD}@cluster0.q20we.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(db_link, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(db => {
    console.log("appointment model connected");
}).catch((err) => {
    console.log(err);
})


const appSchema = new mongoose.Schema({
    patName: {
        type: String,
        required: true
    },

    patEmail: {
        type: String,
    },

    docName: {
        type: String,
        required: true
    },

    fees: {
        type: String
    },

    time: {
        type: String
    },

    date: {
        type: String,
    },
    cloudinary_id: {
        type: String
    },
    avatar:{
        type:String
    }


})

const appModel = mongoose.model("appModel", appSchema);

module.exports = appModel;