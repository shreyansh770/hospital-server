const cloudinary = require('cloudinary')
const { CLOUDNARY_NAME, API_KEY, API_SECRET } = require('../secrets')


cloudinary.config({
    cloud_name:CLOUDNARY_NAME,
    api_key :API_KEY,
    api_secret:API_SECRET
})

module.exports = cloudinary;