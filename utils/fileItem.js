var  fileItemModel =  require("../models/fileItem");

var fileItemModel = require("../models/fileItem");

class fileItem{

    returnFileItemFromFileMulter = (email,fileInfo) =>{

        let fileItemData =  new fileItemModel({

            file_name: fileInfo.filename,

            destination: fileInfo.destination,

            encoding: fileInfo.encoding,

            field_name: fileInfo.fieldname,

            mime_type: fileInfo.mimetype,

            original_name : fileInfo.originalname,

            path: fileInfo.path,

            is_public: false,

            user_id: email,
            
            size: fileInfo.size

        })

        return fileItemData;
    }

}

module.exports = new fileItem();