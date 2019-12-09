let mongoose = require('mongoose')

let fileItemSchema = new mongoose.Schema({

    file_name: String,

    destination: String,

    encoding: String,

    field_name: String,

    mime_type: String,

    original_name : String,

    path: String,

    is_public:Boolean,

    user_id: String,
    
    size: Number
    
})

module.exports = mongoose.model('item', fileItemSchema)