var  fileItemModel =  require("../models/fileItem");

var fileItemUtils = require("../utils/fileItem");

var fs = require('fs');

var path = require('path');

class fileItem{

    putData = async(fileInfo) =>{
       
        let {files,email,id} = fileInfo;

        let formatedFiles = [];

        files.map( eachFile => {

            formatedFiles.push(fileItemUtils.returnFileItemFromFileMulter(email,eachFile));

        })

        let formatedFileSavePromisses = [];

        formatedFiles.map((eachFormatedFile)=>{

            formatedFileSavePromisses.push(this.saveEachItem(eachFormatedFile));

        })

        let formatedFileItemSaveResult = await Promise.all(formatedFileSavePromisses);

        let failedResponses = [];

        formatedFileItemSaveResult.map((eachFormatedSaveResult)=>{

            if(eachFormatedSaveResult["type"] == "fail"){

                failedResponses.push(eachFormatedSaveResult["data"]);

            }

        })

        if(failedResponses.length > 0){

            return({
                type: "fail",
                data: "some files does not stored."
            })

        }else{

            return({
                type: "success",
                data: "all files stored successfully"
            })

        }
        
    }

    saveEachItem = async(data)=>{

        try{
            
            let dataAdd = await data.save();
 
            return({
                 type:"success",
                 data: dataAdd
            })
 
         }catch(error){
 
             return ({
                 type:"fail",
                 data:error
             })
 
         }

    }

    getData = async(query) =>{
        try{

            let data ;

            if(query){

                data = await fileItemModel.find(query).select({ "original_name": 1, "_id": 1, 'size': 1, "is_public": 1, "user_id": 1, "file_name": 1});

            }else{

                data = await fileItemModel.find().select({ "original_name": 1, "_id": 1, 'size': 1, "is_public": 1, "user_id": 1, "file_name": 1});
            
            }

            return ({
                type: "success",
                data
            });

        }catch(err){

            return ({
                type: "fail",
                data : err,
            })

        }
    }

    deleteData = async(dataItem) =>{

        let {id,email} = dataItem;

        let data = {}

        let fileItem = await this.getData({_id:id,user_id:email});

        let filePath = null;

        if(fileItem["type"] == "success" && fileItem["data"] && fileItem["data"].length){

            let item = fileItem["data"][0];

            filePath = path.join(__dirname,'../uploads/'+ email + '/' + item.file_name);

        }

        let delObj = await fileItemModel.remove({ _id: id, user_id: email }, function(err,res) {
            
            if (!err) {
                    fs.unlinkSync(filePath);
                    data.type = 'success';
                    data.data = res
            }
            else {
                    data.type = 'fail';
                    data.data = err
            }

        });

        return({data});
    }

    download = async(dataItem)=>{

        let {id,email} = dataItem;

        if(id){

            let fileItem = await this.getData({_id:id,user_id:email});

            if(fileItem["type"] == "success" && fileItem["data"] && fileItem["data"].length){

                let item = fileItem["data"][0];

                let filePath = path.join(__dirname,'../uploads/'+ email + '/' + item.file_name);

                return({
                    type: "success",
                    data: filePath
                })
    
            }else{

                return({
                    type: "fail",
                    data: "can not fetch document"
                })
    
            }

        }else{

            return({
                type: "fail",
                data: "unique id does not found, fetch file failed."
            })

        }

    }

    updatePrivacy = async(dataItems) =>{

        let {id,is_public,email} = dataItems;

        let fileItem = await this.getData({_id:id,user_id:email});

        if(fileItem["type"] && (fileItem["type"] == "success")){

            let file = fileItem["data"][0];

            file["is_public"] = is_public ;

            try{
                let saveFile = await file.save();

                return({
                    type:"success",
                    data: saveFile
                })

            }catch(err){
                return({
                    type: "fail",
                    data: "something is wrong while saving"+ err
                })

            }

        }else{

            return({
                type: "fail",
                data: "No record found in the data base"
            })

        }
    }

    getAllPublicFilesByUserId = async() =>{

        try{

            let data = await fileItemModel
            .find({"is_public" : true})
            .select({ "original_name": 1, "_id": 1, 'size': 1, "is_public": 1, "user_id": 1, "file_name": 1});

            return({
                type: "success",
                data: data
            })

        }catch(err){

            return({
                type: "fail",
                data: "error while retriving the data"+ err
            })

        }

    }

}

module.exports = new fileItem();