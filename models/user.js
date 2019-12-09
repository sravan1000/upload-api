let mongoose = require('mongoose')

let userSchema = new mongoose.Schema({

    email: {
        type: String,
    },

    password:{
        type: String,
    },

    created_on:{
        type: Date,
    }

})

module.exports = mongoose.model('user', userSchema)